import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from "../../config/AppConfig";
import { ProjectFormData } from "../../schemas/project.schema";
import {
  ICreateProjectRes,
  IGetProteinSequenceRes,
  IGetProteinSequenceReq,
  IGetProjectsRes,
  IGetProjectQueryParam,
  IGetProjectReq,
  IGetProjectRes,
  IUpdateProjectRes,
  IUpdateProjectReq,
  IDeleteProject,
  IDeleteProjectRes,
  IUploadProjectRes,
  IUploadProjectFileReq,
  IGetSummaryReq,
  IGetSummaryRes,
  IGetTopVariantsRes,
  IGetTopVariantsReq,
  IGetScoreDistributionRes,
  IGetScoreDistributionReq
} from "./type";
import { RootState } from "../../store/store";
import { AUTH_TOKEN } from "../../constants/AuthConstant";

export const PROJECT_API_REDUCER_KEY = "projectsApi";
export const projectApi = createApi({
  reducerPath: PROJECT_API_REDUCER_KEY,
  tagTypes: ["GetAllProjects", "GetProjectDetails", "CreateProject", "ProteinSequence"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}`,
    prepareHeaders: async (headers, { getState }) => {
      const isBrowser = typeof window !== undefined;
      const token = (getState() as RootState).auth.token ||
        (isBrowser ? localStorage.getItem(AUTH_TOKEN) : null);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    }
  }),

  endpoints: (builder) => ({
    createProject: builder.mutation<ICreateProjectRes, ProjectFormData>({
      query: (data) => ({
        url: `/projects`,
        method: "POST",
        body: data
      }),

      invalidatesTags: ["GetAllProjects"]
    }),

    getProjects: builder.query<IGetProjectsRes, IGetProjectQueryParam>({
      query: ({ page, limit, search }) => ({
        url: `/projects`,
        params: { page, limit, search }
      }),

      providesTags: ["GetAllProjects"]
    }),

    getProject: builder.query<IGetProjectRes, IGetProjectReq>({
      query: ({ projectId }) => ({
        url: `/projects/${projectId}`
      }),

      providesTags: ["GetProjectDetails"]
    }),

    updateProject: builder.mutation<IUpdateProjectRes, IUpdateProjectReq>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: ["GetAllProjects", "GetProjectDetails"]
    }),

    uploadProjectFile: builder.mutation<IUploadProjectRes, IUploadProjectFileReq>({
      query: ({ data, projectId }) => ({
        url: `/projects/${projectId}/csv-upload`,
        method: "POST",
        body: data
      }),

      invalidatesTags: ["GetProjectDetails"]
    }),

    getSummaryMainMatrices: builder.query<IGetSummaryRes, IGetSummaryReq>({
      query: ({ projectId }) => ({
        url: `/projects/${projectId}/csv-upload/summary-table-of-main-matrices`,
      })
    }),

    getTopVariants: builder.query<IGetTopVariantsRes, IGetTopVariantsReq>({
      query: ({ projectId, limit }) => ({
        url: `/projects/${projectId}/csv-upload/top-performing-variants?limit=${limit}`,
      })
    }),

    getScoreDistribution: builder.query<IGetScoreDistributionRes, IGetScoreDistributionReq>({
      query: ({ projectId }) => ({
        url: `/projects/${projectId}/csv-upload/score-distribution`,
      })
    }),

    deleteProject: builder.mutation<IDeleteProjectRes, IDeleteProject>({
      query: ({ projectId }) => ({
        url: `/projects/${projectId}`,
        method: "DELETE"
      }),

      invalidatesTags: ["GetAllProjects"]
    })

    // getProteinSequence: builder.query<IGetProteinSequenceRes, IGetProteinSequenceReq>({
    //   query: ({ uniprotId }) => `/uniprot/${uniprotId}`,
    //   providesTags: ["ProteinSequence"]
    // }),
  }),

  refetchOnFocus: true,
  refetchOnReconnect: true
})

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadProjectFileMutation,
  useGetSummaryMainMatricesQuery,
  useGetTopVariantsQuery,
  useGetScoreDistributionQuery
  // useGetProteinSequenceQuery,
} = projectApi;
