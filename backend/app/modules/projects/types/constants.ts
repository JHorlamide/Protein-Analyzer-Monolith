export const RES_MSG = {
  PROJECT_CREATED: "Project created successfully",
  PROJECTS_FETCHED: "Projects fetched successfully",
  PROJECT_FETCHED: "Project fetched successfully",
  PROJECT_UPDATED: "Project updated successfully",
  PROTEIN_SEQUENCE_FETCHED: "Protein sequence fetched successfully",
  PROJECT_NOT_FOUND: "Project not found",
  PROJECT_DELETED: "Project deleted successfully",
  FILE_UPLOADED: "File uploaded and data saved successfully"
}

export const ERR_MSG = {
  UNIPROT_ID_REQUIRED: "uniprotId is required",
  INVALID_UNIPROT_ID: "Invalid uniprotId",
  PDB_ID_REQUIRED: "proteinPDBID is required",
  USER_ID_REQUIRED: "userId is required",
  PROJECT_ID_REQUIRED: "projectId is a required fields",
  PROJECT_NOT_FOUND: "Project not found",
  INVALID_PROJECT_DATA: "projectTitle, projectGoal, and, measuredProperty are required fields",
  INVALID_CSV_STRUCTURE: "CSV file must contain columns: sequence, fitness, muts and must contain at least one row with muts = WT",
  // MUT_NOT_FOUND: "CSV file must contain at least one row with muts = WT",
  ERR_PROCESSING_CSV: "Error processing CSV file",
  NO_FILE_UPLOAD: "No file uploaded",
  NO_FILE_VALIDATION: "No file was uploaded for validation",
  FILE_VALIDATION_ERROR: "An error occurred during CSV validation"
}