import BaseClass from './baseClass'
import type * as mT from '../types/pet'

/**
 * @description Everything about your Pets
 */
export default class Pet extends BaseClass {
  /**
   * @id addPet
   * @description Add a new pet to the store
   */
  addPet: mT.AddPet = body => {
    const url = '/pet'
    console.log(url)
    console.log(url)
    console.log(url)
    const config = { url, body: { body }, method: 'post' }
    return this.request(config)
  }

  /**
   * @id updatePet
   * @description Update an existing pet
   */
  updatePet: mT.UpdatePet = body => {
    const url = '/pet'
    const config = { url, body: { body }, method: 'put' }
    return this.request(config)
  }

  /**
   * @id getPetById
   * @description Find pet by ID，Returns a single pet
   */
  getPetById: mT.GetPetById = petId => {
    const url = `/pet/${petId}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @id updatePetWithForm
   * @description Updates a pet in the store with form data
   */
  updatePetWithForm: mT.UpdatePetWithForm = params => {
    const { petId, name, status } = params
    const formData = this.formData({ name, status })
    const url = `/pet/${petId}`
    const config = { url, formData, method: 'post' }
    return this.request(config)
  }

  /**
   * @id deletePet
   * @description Deletes a pet
   */
  deletePet: mT.DeletePet = params => {
    const { api_key, petId } = params
    const headers = { api_key }
    const url = `/pet/${petId}`
    const config = { url, headers, method: 'delete' }
    return this.request(config)
  }

  /**
   * @id findPetsByTags
   * @description Finds Pets by tags，Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   */
  findPetsByTags: mT.FindPetsByTags = tags => {
    const url = `/pet/findByTags?${this.serialize({ tags })}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @id findPetsByStatus
   * @description Finds Pets by status，Multiple status values can be provided with comma separated strings
   */
  findPetsByStatus: mT.FindPetsByStatus = status => {
    const url = `/pet/findByStatus?${this.serialize({ status })}`
    const config = { url, method: 'get' }
    return this.request(config)
  }

  /**
   * @id uploadFile
   * @description uploads an image
   */
  uploadFile: mT.UploadFile = params => {
    const { petId, additionalMetadata, file } = params
    const formData = this.formData({ additionalMetadata, file })
    const url = `/pet/${petId}/uploadImage`
    const config = { url, formData, method: 'post' }
    return this.request(config)
  }
}

export const pet = new Pet()