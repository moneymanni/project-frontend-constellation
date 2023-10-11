export default {
  async registerNote (context, data) {
    // 새로운 노트를 저장해서 백엔드로 넘기는 작업
    const noteData = {
      title: data.title,
      description: data.description,
      sharedPermission: 1
    }

    const url = 'http://127.0.0.1:5000/note/create'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: context.rootGetters.accessToken
      },
      body: JSON.stringify(noteData)
    })
    // const responseData = await response.json();
    if (!response.ok) {
      // error ...
    }
  },
  async loadNoteList (context, payload) {
    // 노트 리스트를 백엔드로부터 fetch하는 작업
    const url = 'http://127.0.0.1:5000/note/list'
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

    const noteList = []

    for (const item of responseData.data.noteList) {
      const note = {
        noteId: item.noteId,
        title: item.title,
        description: item.description,
        sharedPermission: item.sharedPermission,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
      noteList.push(note)
    }

    context.commit('setNoteList', noteList)
  }
}
