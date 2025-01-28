'use client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }
  
  return null
}

export const getAction = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return handleResponse(response)
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const postAction = async (endpoint, data) => {
  try {
    // Check if data is FormData
    const isFormData = data instanceof FormData
    
    // Set appropriate headers based on data type
    const headers = isFormData ? {} : {
      'Content-Type': 'application/json'
    }
    
    // Prepare body based on data type
    const body = isFormData ? data : JSON.stringify(data)
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body
    })
    return handleResponse(response)
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const patchAction = async (endpoint, data) => {
  try {
    const headers = data instanceof FormData 
      ? {} 
      : { 'Content-Type': 'application/json' }
    
    const body = data instanceof FormData
      ? data
      : JSON.stringify(data)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body
    })
    return handleResponse(response)
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const deleteAction = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      if(body){
        body
      }
    })
    return handleResponse(response)
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}