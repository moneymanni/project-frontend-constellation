export default {
  setNoteId (state, payload) {
    state.noteId = payload
  },
  setPageId (state, payload) {
    state.pageId = payload
  },
  setPageList (state, payload) {
    state.pageList = payload
  },
  setNodeList (state, payload) {
    state.nodeList = payload
  },
  setEdgeList (state, payload) {
    state.edgeList = payload
  },
  setGraphElements (state, payload) {
    state.graphElements = payload
  },
  setRecommendKeywords (state, payload) {
    state.recommendKeywords = payload
  }
}
