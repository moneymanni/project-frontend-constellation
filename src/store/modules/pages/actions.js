export default {
  setNoteId (context, data) {
    context.commit('setNoteId', data)
  },
  setPageId (context, data) {
    context.commit('setPageId', data)
  },
  async addPage (context, data) {
    const pageInfo = {
      title: data.title,
      keyword: data.keyword,
      content: '',
      noteId: context.getters.noteId
    }

    const url = 'http://127.0.0.1:5000/page/create'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify(pageInfo)
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
    // const responseData = await response.json()
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
    // const responseData = await response.json()
    if (!response.ok) {
      // error ...
    }
  },
  async recommendKeywords (context, payload) {
    let url = `http://127.0.0.1:5000/recommend/association?keyword=${payload.node.keyword}&pageId=${payload.node.id}`

    if (payload.mode === 'trend') {
      url = `http://127.0.0.1:5000/recommend/trend?keyword=${payload.node.keyword}&pageId=${payload.node.id}`
    }

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

    const keywordList = []

    const alpabet = ['a', 'b', 'c', 'd', 'e']
    let cnt = 0

    // TODO: 차후 반드시 page_id를 pageId로 바꿀것
    for (const item of responseData.data.recommend) {
      const keyword = {
        id: alpabet[cnt++],
        keyword: item.keyword
      }
      keywordList.push(keyword)
    }
    context.commit('setRecommendKeywords', keywordList)
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
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!')
      throw error
    }

    const nodeList = []

    // TODO: 차후 반드시 page_id를 pageId로 바꿀것
    for (const item of responseData.data.nodeList) {
      const node = {
        pageId: item.pageId,
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
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      }
    })
    const responseData = await response.json()

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!')
      throw error
    }

    const edgeList = []

    // TODO: 차후 반드시 pageId와 linkedPageId, createdAt으로 바꿀것
    for (const item of responseData.data.edgeList) {
      const edge = {
        pageId: item.pageId,
        linkedPageId: item.linkedPageId,
        linkage: item.linkage,
        createdAt: item.createdAt
      }
      edgeList.push(edge)
    }
    context.commit('setEdgeList', edgeList)
  }
}
