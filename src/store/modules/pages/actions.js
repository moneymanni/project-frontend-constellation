export default {
  setNoteId (context, data) {
    context.commit('setNoteId', data)
  },
  async addPage (context, data) {
    const url = 'http://127.0.0.1:5000/page/create'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify({ noteId: context.getters.noteId })
    })
    // const responseData = await response.json();
    if (!response.ok) {
      // error ...
    }
  },
  async changePageHeader (context, data) {
    const pageHeaderData = {
      title: data.title,
      keyword: data.keyword,
      pageId: data.pageId
    }

    const url = 'http://127.0.0.1:5000/page/update-header'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify(pageHeaderData)
    })
    // const responseData = await response.json();
    if (!response.ok) {
      // error ...
    }
  },
  async changePageContent (context, data) {
    const pageContentData = {
      pageId: data.pageId,
      content: data.content
    }

    const url = 'http://127.0.0.1:5000/page/update-content'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify(pageContentData)
    })
    // const responseData = await response.json();
    if (!response.ok) {
      // error ...
    }
  },
  async deletePage (context, data) {
    const url = 'http://127.0.0.1:5000/page/delete'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify({ pageId: data.pageId })
    })
    // const responseData = await response.json();
    if (!response.ok) {
      // error ...
    }
  },
  async createLink (context, data) {
    const linkInfo = {
      pageId: data.pageId,
      linkedPageId: data.linkedPageId,
      linkage: data.linkage
    }

    const url = 'http://127.0.0.1:5000/link/create'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify(linkInfo)
    })
    const responseData = await response.json()
    console.log(responseData)
    if (!response.ok) {
      // error ...
    }
  },
  async deleteLink (context, data) {
    const url = 'http://127.0.0.1:5000/link/delete'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify({
        pageId: data.pageId,
        linkedPageId: data.linkedPageId
      })
    })
    const responseData = await response.json()
    console.log(responseData)
    if (!response.ok) {
      // error ...
    }
  },
  prepareGraphElements (context, _) {
    const nodeList = context.getters.nodeList || []
    const edgeList = context.getters.edgeList || []

    const nodes = nodeList.map(node => ({
      data: {
        id: node.pageId,
        keyword: node.keyword
      }
    }))

    const edges = edgeList.map(edge => ({
      data: {
        id: `edge-${edge.pageId}-${edge.linkedPageId}`,
        source: edge.pageId,
        target: edge.linkedPageId
      }
    }))

    const elements = nodes.concat(edges)
    context.commit('setGraphElements', elements)
  },
  async loadPageList (context, payload) {
    const url = 'http://127.0.0.1:5000/page/list?noteId=' + context.getters.noteId
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!')
      throw error
    }

    const pageList = []

    for (const item of responseData.data.pageList) {
      const page = {
        pageId: item.pageId,
        title: item.title,
        keyword: item.keyword,
        content: item.content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
      pageList.push(page)
    }
    context.commit('setPageList', pageList)
  },
  async loadNodeList (context, payload) {
    const url = 'http://127.0.0.1:5000/visualization/node?noteId=' + context.getters.noteId
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!')
      throw error
    }

    const nodeList = []

    // TODO: 차후 반드시 page_id를 pageId로 바꿀것
    for (const item of responseData.node) {
      const node = {
        pageId: item.page_id,
        keyword: item.keyword
      }
      nodeList.push(node)
    }
    context.commit('setNodeList', nodeList)
  },
  async loadEdgeList (context, payload) {
    const url = 'http://127.0.0.1:5000/visualization/edge?noteId=' + context.getters.noteId
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!')
      throw error
    }

    const edgeList = []

    // TODO: 차후 반드시 pageId와 linkedPageId, createdAt으로 바꿀것
    for (const item of responseData.edge) {
      const edge = {
        pageId: item.page_id,
        linkedPageId: item.linked_page_id,
        linkage: item.linkage,
        createdAt: item.created_at
      }
      edgeList.push(edge)
    }
    context.commit('setEdgeList', edgeList)
  }
}
