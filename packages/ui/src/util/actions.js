'use client'

const API_BASE_URL = 'https://172.16.2.57/api/v1'

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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
      ? {} // Let browser set Content-Type for FormData
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

export const deleteAction = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
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