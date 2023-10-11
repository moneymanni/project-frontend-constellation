export default {
  noteList (state) {
    return state.noteList
  },
  hasNoteList (state) {
    return state.noteList && state.noteList.length > 0
  }
}
