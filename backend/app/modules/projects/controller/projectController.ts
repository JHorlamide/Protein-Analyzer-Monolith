import { Request, Response } from "express";
import asyncHandler from "../../../common/middleware/asyncHandler";
import projectService from "../services/projectService";
import responseHandler from "../../../common/responseHandler";
import { RES_MSG, ERR_MSG } from "../types/constants";
import uniprotService from "../services/uniprot.service";
import s3Service from "../s3Service/s3Service";
import config from "../../../config/appConfig";
import redisCash from "../RedisCash/redisCash";

class ProjectController {
  public createProject = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = res.locals.jwt;
    const project = await projectService.createProject({ user: userId, ...req.body });
    responseHandler.successfullyCreated(RES_MSG.PROJECT_CREATED, project, res);
  })

  public getProteinSequence = asyncHandler(async (req: Request, res: Response) => {
    const { uniprotId } = req.params;
    const proteinSequence = await uniprotService.getProteinSequence(uniprotId);
    responseHandler.successResponse(RES_MSG.PROTEIN_SEQUENCE_FETCHED, proteinSequence, res);
  })

  public getAllProjects = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search } = req.query;
    const { userId } = res.locals.jwt;

    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const searchString = search ? String(search) : "";

    const getProjectPrams = {
      userId,
      page: pageNumber,
      limit: limitNumber,
      search: searchString
    }

    const projects = await projectService.getAllProjects(getProjectPrams);
    responseHandler.successResponse(RES_MSG.PROJECTS_FETCHED, projects, res);
  })

  public getProjectDetail = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const project = await projectService.getProjectById(projectId);
    responseHandler.successResponse(RES_MSG.PROJECT_FETCHED, project, res);
  })

  public updateProjectDetails = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const updatedProject = await projectService.updateProject({ projectId, projectData: req.body });
    responseHandler.successResponse(RES_MSG.PROJECT_UPDATED, updatedProject, res);
  })

  public deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    await projectService.deleteProject(projectId);
    responseHandler.noContent(RES_MSG.PROJECT_DELETED, res);
  })

  public uploadProjectCSV = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    const { projectId } = req.params;

    if (!file) {
      return responseHandler.badRequest(ERR_MSG.NO_FILE_UPLOAD, res);
    }

    await projectService.uploadProjectFile(projectId, file);
    return responseHandler.noContent(RES_MSG.FILE_UPLOADED, res);
  })

  public getSummaryOfMainMatricesData = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { summaryCacheKey } = config;
    const cacheKey = `${summaryCacheKey}-${projectId}`;

    const projectFileKey = await projectService.getProjectFileKey(projectId);
    const s3ReadStream = s3Service.getFile(projectFileKey);
    const csvData = await projectService.parseS3ReadStream(s3ReadStream);

    // 5. Number of sequences with a score above the reference sequence (with value "WT" in "muts" column)
    const numSequencesAboveReference = projectService.getSequencesAboveReference(csvData);

    // 2. List of the 10 mutants with the highest fitness values
    const topMutants = projectService.getTopMutants(csvData);

    // 6. Value of the sequence with the highest fitness value
    const highestFitness = projectService.getHighestFitness(csvData);

    // 7. Fold Improvement over wild type
    const foldImprovement = projectService.getFoldImprovement(csvData);

    const resData = {
      totalSequence: numSequencesAboveReference.totalSequences,
      topMutants,
      numSequencesAboveReference,
      percentageSequencesAboveReference: numSequencesAboveReference.hitRate,
      highestFitness,
      foldImprovement,
    }

    // Cache the data for future requests
    // Cache for 1 hour (3600 seconds)
    await redisCash.setCacheData2(cacheKey, 3600, resData)
    responseHandler.successResponse(RES_MSG.SUMMARY_FETCHED, resData, res);
  })

  public getTopPerformingVariantsData = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { topVariantCacheKey } = config;
    const cachedKey = `${topVariantCacheKey}-${projectId}`;

    const projectFileKey = await projectService.getProjectFileKey(projectId);
    const s3ReadStream = s3Service.getFile(projectFileKey);
    const csvData = await projectService.parseS3ReadStream(s3ReadStream);

    // 4. For each individual mutation, the range of scores for sequences that include this mutation
    const mutationRanges = projectService.getMutationRange(csvData);

    // Cache the data for future requests
    // Cache for 1 hour (3600 seconds)
    await redisCash.setCacheData2(cachedKey, 3600, mutationRanges);
    responseHandler.successResponse(RES_MSG.TOP_PERFORMING_VARIANTS_FETCHED, {
      mutationRanges
    }, res);
  })

  public processCVSFile = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const projectFileKey = await projectService.getProjectFileKey(projectId);
    const s3ReadStream = s3Service.getFile(projectFileKey);
    const csvData = await projectService.parseS3ReadStream(s3ReadStream);

    try {
      // 1. Distribution of fitness scores as a histogram
      // The reference sequence should be highlighted in the histogram
      const histogramWithReference = projectService.getHistogramData(csvData);

      // 2. List of the 10 mutants with the highest fitness values
      const topMutants = projectService.getTopMutants(csvData);

      // 3. Distribution of the number of mutations per sequence
      const mutationDistribution = projectService.getMutationDistribution(csvData);

      // 4. For each individual mutation, the range of scores for sequences that include this mutation
      const mutationRanges = projectService.getMutationRange(csvData);

      // 5. Number of sequences with a score above the reference sequence (with value "WT" in "muts" column)
      const numSequencesAboveReference = projectService.getSequencesAboveReference(csvData);

      // 6. Value of the sequence with the highest fitness value
      const highestFitness = projectService.getHighestFitness(csvData);

      // 7. Fold Improvement over wild type
      const foldImprovement = projectService.getFoldImprovement(csvData);

      responseHandler.successResponse("Data fetched for rendering", {
        topMutants,
        foldImprovement,
        mutationRanges,
        highestFitness,
        mutationDistribution,
        numSequencesAboveReference,
        histogramData: histogramWithReference,
        totalSequence: numSequencesAboveReference.totalSequences,
        percentageSequencesAboveReference: numSequencesAboveReference.hitRate,
      }, res);
    } catch (error: any) {
      return responseHandler.serverError(error.message, res);
    }
  })
}

export default new ProjectController();
