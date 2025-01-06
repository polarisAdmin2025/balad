'use server'

export const getAction = async link => {
  try {
    const response = await fetch('http://172.16.2.59:8000/api/v1' + link, {
      method: 'GET'
    })
    return await response.json()
  } catch (error) {
    return error
  }
}

export const postAction = async (link, appData) => {
  const jsonBody = JSON.stringify(appData)
  try {
    const response = await fetch('http://172.16.2.59:8000/api/v1' + link, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonBody
    })
    return await response.json()
  } catch (error) {
    return error
  }
}

export const patchAction = async (link, appData) => {
  const jsonBody = JSON.stringify(appData)
  try {
    const response = await fetch('http://172.16.2.59:8000/api/v1' + link, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonBody
    })
    return await response.json()
  } catch (error) {
    return error
  }
}
export const deleteAction = async link => {
  const jsonBody = JSON.stringify()
  try {
    const response = await fetch('http://172.16.2.59:8000/api/v1' + link, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonBody
    })
    return response.status
  } catch (error) {
    return error
  }
}
