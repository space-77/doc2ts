import type * as defs from './type'
export interface AddPetParam {
  /** @description Pet object that needs to be added to the store */
  body: defs.Pet
}
export interface UpdatePetParam {
  /** @description Pet object that needs to be added to the store */
  body: defs.Pet
}
export interface GetPetByIdParam {
  /** @description ID of pet to return */
  petId: number
}
export interface UpdatePetWithFormParam {
  /** @description ID of pet that needs to be updated */
  petId: number
  /** @description Updated name of the pet */
  name?: string
  /** @description Updated status of the pet */
  status?: string
}
export interface DeletePetParam {
  api_key?: string
  /** @description Pet id to delete */
  petId: number
}
export interface FindPetsByTagsParam {
  /** @description Tags to filter by */
  tags: Array<string>
}
export interface FindPetsByStatusParam {
  /** @description Status values that need to be considered for filter */
  status: Array<string>
}
export interface UploadFileParam {
  /** @description ID of pet to update */
  petId: number
  /** @description Additional data to pass to server */
  additionalMetadata?: string
  /** @description file to upload */
  file?: File
}
export type AddPetBody = any
export type UpdatePetBody = any
export type GetPetByIdBody = defs.Pet
export type UpdatePetWithFormBody = any
export type DeletePetBody = any
export type FindPetsByTagsBody = Array<defs.Pet>
export type FindPetsByStatusBody = Array<defs.Pet>
export type UploadFileBody = defs.ApiResponse
export type AddPet = (body: AddPetParam['body']) => Promise<AddPetBody>

export type UpdatePet = (body: UpdatePetParam['body']) => Promise<UpdatePetBody>

export type GetPetById = (petId: GetPetByIdParam['petId']) => Promise<GetPetByIdBody>

export type UpdatePetWithForm = (params: UpdatePetWithFormParam) => Promise<UpdatePetWithFormBody>

export type DeletePet = (params: DeletePetParam) => Promise<DeletePetBody>

export type FindPetsByTags = (tags: FindPetsByTagsParam['tags']) => Promise<FindPetsByTagsBody>

export type FindPetsByStatus = (status: FindPetsByStatusParam['status']) => Promise<FindPetsByStatusBody>

export type UploadFile = (params: UploadFileParam) => Promise<UploadFileBody>
