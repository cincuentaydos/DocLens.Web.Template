import { useState } from 'react'

import { uploadFile } from '../api/uploadFile'
import type { UploadFileState } from '../model/types'

export function UploadFileForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [state, setState] = useState<UploadFileState>({
    loading: false,
    data: null,
    error: null,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedFile) {
      setState({
        loading: false,
        data: null,
        error: 'Select a file before uploading.',
      })
      return
    }

    setState({
      loading: true,
      data: null,
      error: null,
    })

    try {
      const data = await uploadFile(selectedFile)

      setState({
        loading: false,
        data,
        error: null,
      })
    } catch (error) {
      setState({
        loading: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected error while uploading file',
      })
    }
  }

  return (
    <section className="upload-file-panel">
      <h2 className="upload-file-panel__title">Upload file PoC</h2>

      <p className="upload-file-panel__description">
        Selecciona un archivo y envíalo mediante el endpoint local generado por
        floci. La petición debe llegar a la Lambda de subida y devolver una
        respuesta 200.
      </p>

      <form className="upload-file-form" onSubmit={handleSubmit}>
        <input
          className="upload-file-form__input"
          type="file"
          onChange={(event) =>
            setSelectedFile(event.target.files?.item(0) ?? null)
          }
        />

        <button
          className="poc-api-check-button"
          type="submit"
          disabled={state.loading}
        >
          {state.loading ? 'Uploading file...' : 'Upload file to Lambda'}
        </button>
      </form>

      {selectedFile && (
        <p className="upload-file-panel__text">
          Selected file: {selectedFile.name}
        </p>
      )}

      {state.error && (
        <p className="upload-file-panel__error" role="alert">
          Error: {state.error}
        </p>
      )}

      {state.data && (
        <div className="upload-file-result">
          <p>Status: {state.data.status}</p>
          <p>Service: {state.data.service}</p>
          <p>Message: {state.data.message ?? 'File uploaded successfully.'}</p>
          <p>Filename: {state.data.filename ?? selectedFile?.name ?? 'unknown'}</p>
          <p>Timestamp: {state.data.timestamp ?? 'not provided'}</p>
        </div>
      )}
    </section>
  )
}
