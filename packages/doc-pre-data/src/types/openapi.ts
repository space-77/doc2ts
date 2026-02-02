import type { OpenAPIV3 } from 'openapi-types'

export type Document = OpenAPIV3.Document
export type SchemaObject = OpenAPIV3.SchemaObject
export type ResponseObject = OpenAPIV3.ResponseObject
export type OperationObject = OpenAPIV3.OperationObject
export type ReferenceObject = OpenAPIV3.ReferenceObject
export type ParameterObject = OpenAPIV3.ParameterObject
export type MediaTypeObject = OpenAPIV3.MediaTypeObject
export type BaseSchemaObject = OpenAPIV3.BaseSchemaObject
export type ComponentsObject = OpenAPIV3.ComponentsObject
export type ArraySchemaObject = OpenAPIV3.ArraySchemaObject
export type RequestBodyObject = OpenAPIV3.RequestBodyObject
export type NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject
export type ArraySchemaObjectType = OpenAPIV3.ArraySchemaObjectType
export type NonArraySchemaObjectType = OpenAPIV3.NonArraySchemaObjectType
export type ExternalDocumentationObject = OpenAPIV3.ExternalDocumentationObject

export type GenericsType = SchemaObject & Partial<ReferenceObject>
// export type SchemaItemsObject = { type?: SchemaObjectType; items?: GenericsType; $ref?: string }

export type SchemaObjectType = NonArraySchemaObjectType | ArraySchemaObjectType
export type SchemasData = ReferenceObject | SchemaObject

export type BodyObject = ReferenceObject | RequestBodyObject
export type ResponseData = ReferenceObject | ResponseObject

export type Properties = SchemasData
