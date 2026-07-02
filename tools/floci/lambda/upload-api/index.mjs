const jsonHeaders = {
  'content-type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
}

function response(statusCode, payload) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  }
}

function decodePayload(body, isBase64Encoded) {
  if (!body) {
    return ''
  }

  if (isBase64Encoded) {
    return Buffer.from(body, 'base64').toString('utf8')
  }

  return body
}

function parseUploadPayload(rawBody) {
  if (!rawBody) {
    return { payload: {}, parseMode: 'empty' }
  }

  try {
    return {
      payload: JSON.parse(rawBody),
      parseMode: 'json',
    }
  } catch {
    return {
      payload: { content: rawBody },
      parseMode: 'raw',
    }
  }
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method ?? event.httpMethod ?? 'GET'
  const path = event.rawPath ?? event.path ?? '/'

  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: jsonHeaders,
      body: '',
    }
  }

  if (method === 'GET' && path.endsWith('/health')) {
    return response(200, {
      status: 'ok',
      service: 'doclens-api-gateway',
      environment: process.env.APP_ENV ?? 'local',
      timestamp: new Date().toISOString(),
    })
  }

  if (method === 'POST' && path.endsWith('/upload-file')) {
    const rawBody = decodePayload(event.body, event.isBase64Encoded)
    const { payload, parseMode } = parseUploadPayload(rawBody)

    const fileName =
      typeof payload.fileName === 'string' && payload.fileName.trim().length > 0
        ? payload.fileName.trim()
        : 'documento-simulado.pdf'

    const contentType =
      typeof payload.contentType === 'string' && payload.contentType.trim().length > 0
        ? payload.contentType.trim()
        : 'application/octet-stream'

    const content =
      typeof payload.content === 'string'
        ? payload.content
        : JSON.stringify(payload.content ?? '')

    return response(200, {
      uploaded: true,
      message: 'Documento recibido correctamente',
      fileName,
      contentType,
      parseMode,
      size: content.length,
      timestamp: new Date().toISOString(),
    })
  }

  return response(404, {
    message: 'Route not found',
    method,
    path,
  })
}
