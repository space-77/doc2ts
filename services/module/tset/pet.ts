import BaseClass from '../baseClass'
import type * as mT from '../../types/tset/pet'

/**
 * @description Everything about your Pets
 */
export default class Pet extends BaseClass {
  
/**
 * @name tsetAddPet
 * @description Add a new pet to the store
 */
addPet: mT.AddPet = body => {
  const url = '/pet'
  const config = { '/pet',body: body, method: 'post' }
  return this.request(config)
}


/**
 * @name tsetUpdatePet
 * @description Update an existing pet
 */
updatePet: mT.UpdatePet = body => {
  const url = '/pet'
  const config = { '/pet',body: body, method: 'put' }
  return this.request(config)
}


/**
 * @name tsetGetPetById
 * @description Find pet by ID，Returns a single pet
 */
getPetById: mT.GetPetById = petId => {
  const url = `/pet/${petId}`
  const config = { `/pet/${petId}`, method: 'get' }
  return this.request(config)
}


/**
 * @name tsetUpdatePetWithForm
 * @description Updates a pet in the store with form data
 */
updatePetWithForm: mT.UpdatePetWithForm = params => {
const { petId,name,status } = params
const formData = this.formData({name,status})
const headers = {Content-Type: 'application/x-www-form-urlencoded; charset=UTF-8'}
  const url = `/pet/${petId}`
  const config = { `/pet/${petId}`, headers, formData, method: 'post' }
  return this.request(config)
}


/**
 * @name tsetDeletePet
 * @description Deletes a pet
 */
deletePet: mT.DeletePet = params => {
const { api_key,petId } = params
const headers = {api_key}
  const url = `/pet/${petId}`
  const config = { `/pet/${petId}`, headers, method: 'delete' }
  return this.request(config)
}


/**
 * @name tsetFindPetsByTags
 * @description Finds Pets by tags，Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 */
findPetsByTags: mT.FindPetsByTags = tags => {
  const url = `/pet/findByTags?${this.serialize({tags})}`
  const config = { `/pet/findByTags?${this.serialize({tags})}`, method: 'get' }
  return this.request(config)
}


/**
 * @name tsetFindPetsByStatus
 * @description Finds Pets by status，Multiple status values can be provided with comma separated strings
 */
findPetsByStatus: mT.FindPetsByStatus = status => {
  const url = `/pet/findByStatus?${this.serialize({status})}`
  const config = { `/pet/findByStatus?${this.serialize({status})}`, method: 'get' }
  return this.request(config)
}


/**
 * @name tsetUploadFile
 * @description uploads an image
 */
uploadFile: mT.UploadFile = params => {
const { petId,additionalMetadata,file } = params
const formData = this.formData({additionalMetadata,file})
const headers = {Content-Type: 'application/x-www-form-urlencoded; charset=UTF-8'}
  const url = `/pet/${petId}/uploadImage`
  const config = { `/pet/${petId}/uploadImage`, headers, formData, method: 'post' }
  return this.request(config)
}
}

export const pet = new Pet()
