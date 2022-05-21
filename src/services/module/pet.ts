import BaseClass from './baseClass'
import * as mT from '../types/pet'

/**
 * @description Everything about your Pets
 */
export default class Pet extends BaseClass {
  /**
   * @description Add a new pet to the store
   */
  addPet: mT.AddPet = body => {
    return this.request({ url: '/pet', body, method: 'post' })
  }
  /**
   * @description Update an existing pet
   */
  updatePet: mT.UpdatePet = body => {
    return this.request({ url: '/pet', body, method: 'put' })
  }
  /**
   * @description Find pet by ID，Returns a single pet
   */
  getPetById: mT.GetPetById = params => {
    const { petId } = params
    return this.request({ url: `/pet/${petId}`, method: 'get' })
  }
  /**
   * @description Updates a pet in the store with form data
   */
  updatePetWithForm: mT.UpdatePetWithForm = params => {
    const { petId, name, status } = params
    const formData = this.formData({ name, status })
    return this.request({ url: `/pet/${petId}`, formData, method: 'post' })
  }
  /**
   * @description Deletes a pet
   */
  deletePet: mT.DeletePet = params => {
    const { api_key, petId } = params
    const header = { api_key }
    return this.request({ url: `/pet/${petId}`, header, method: 'delete' })
  }
  /**
   * @description Finds Pets by tags，Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   */
  findPetsByTags: mT.FindPetsByTags = params => {
    const query = this.serialize(params)
    return this.request({ url: `/pet/findByTags?${query}`, method: 'get' })
  }
  /**
   * @description Finds Pets by status，Multiple status values can be provided with comma separated strings
   */
  findPetsByStatus: mT.FindPetsByStatus = params => {
    const query = this.serialize(params)
    return this.request({ url: `/pet/findByStatus?${query}`, method: 'get' })
  }
  /**
   * @description uploads an image
   */
  uploadFile: mT.UploadFile = params => {
    const { petId, additionalMetadata, file } = params
    const formData = this.formData({ additionalMetadata, file })
    return this.request({ url: `/pet/${petId}/uploadImage`, formData, method: 'post' })
  }
}

export const pet = new Pet()
