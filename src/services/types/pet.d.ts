import { Pet, ApiResponse } from './type'
export type AddPetParam = {
  /** @description Pet object that needs to be added to the store*/
  body: Pet
}
export type UpdatePetParam = {
  /** @description Pet object that needs to be added to the store*/
  body: Pet
}
export type GetPetByIdParam = {
  /** @description ID of pet to return*/
  petId: number
}
export type UpdatePetWithFormParam = {
  /** @description ID of pet that needs to be updated*/
  petId: number
  /** @description Updated name of the pet*/
  name?: string
  /** @description Updated status of the pet*/
  status?: string
}
export type DeletePetParam = {
  api_key?: string
  /** @description Pet id to delete*/
  petId: number
}
export type FindPetsByTagsParam = {
  /** @description Tags to filter by*/
  tags: Array<string>
}
export type FindPetsByStatusParam = {
  /** @description Status values that need to be considered for filter*/
  status: Array<string>
}
export type UploadFileParam = {
  /** @description ID of pet to update*/
  petId: number
  /** @description Additional data to pass to server*/
  additionalMetadata?: string
  /** @description file to upload*/
  file?: File
}
export type AddPetBody = any
export type UpdatePetBody = any
export type GetPetByIdBody = Pet
export type UpdatePetWithFormBody = any
export type DeletePetBody = any
export type FindPetsByTagsBody = Array<Pet>
export type FindPetsByStatusBody = Array<Pet>
export type UploadFileBody = ApiResponse
type AddPetResponse = Promise<AddPetBody>
type UpdatePetResponse = Promise<UpdatePetBody>
type GetPetByIdResponse = Promise<GetPetByIdBody>
type UpdatePetWithFormResponse = Promise<UpdatePetWithFormBody>
type DeletePetResponse = Promise<DeletePetBody>
type FindPetsByTagsResponse = Promise<FindPetsByTagsBody>
type FindPetsByStatusResponse = Promise<FindPetsByStatusBody>
type UploadFileResponse = Promise<UploadFileBody>
export type AddPet = (params: AddPetParam) => AddPetResponse

export type UpdatePet = (params: UpdatePetParam) => UpdatePetResponse

export type GetPetById = (params: GetPetByIdParam) => GetPetByIdResponse

export type UpdatePetWithForm = (params: UpdatePetWithFormParam) => UpdatePetWithFormResponse

export type DeletePet = (params: DeletePetParam) => DeletePetResponse

export type FindPetsByTags = (params: FindPetsByTagsParam) => FindPetsByTagsResponse

export type FindPetsByStatus = (params: FindPetsByStatusParam) => FindPetsByStatusResponse

export type UploadFile = (params: UploadFileParam) => UploadFileResponse
