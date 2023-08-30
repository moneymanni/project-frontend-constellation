<template>
<div class="container-fluid">
  <div class="row">
    <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
      <resources-list :notes="notes" @select-page="selectPage" @add-page="addPage"></resources-list>
    </div>
    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <print-resource :pageIsSelected="pageIsSelected" @change-graph="changeGraph"></print-resource>
    </main>
  </div>
</div>
</template>

<script>
import PrintResource from './PrintResource.vue';
import ResourcesList from './ResourcesList.vue';
import cytoscape from 'cytoscape';
import axios from 'axios';

export default {
  components: {
    ResourcesList,
    PrintResource,
  },
  provide() {
    return {
      page: this.selectedPage,
      changeHeader: this.changePageHeader,
      changeContent: this.changePageContent,
      updateLink: this.updateLink,
      deletePage: this.deletePage,
      node: this.nodes,
      edge: this.edges,
      showGraph: this.showGraph,
    };
  },
  data() {
    return {
      pageIsSelected: null,
      selectedPage: {
        id: null,
        title: '',
        keyword: '',
        content: '',
        linkedPageId: null,
        linkedPageKeyword: ''
      },
      notes: [],
      nodes: [],
      edges: [],
      nodeList: [],
      edgeList: []
    };
  },
  methods: {
    selectPage(pageId) {
      this.pageIsSelected = 'change';
      const identifiedNote = this.notes.find(note => note.id === pageId);
      this.selectedPage['id'] = identifiedNote.id;
      this.selectedPage['title'] = identifiedNote.title;
      this.selectedPage['keyword'] = identifiedNote.keyword;
      this.selectedPage['content'] = identifiedNote.content;

      const identifiedEdge = this.edges.find(edge => edge.page_id === pageId);
      if (identifiedEdge) {
        const edgeName = this.nodes.find(node => node.page_id === identifiedEdge.linked_page_id);
        this.selectedPage['linkedPageId'] = identifiedEdge.linked_page_id;
        this.selectedPage['linkedPageKeyword'] = edgeName.keyword;
      } else {
        this.selectedPage['linkedPageId'] = null;
        this.selectedPage['linkedPageKeyword'] = '';
      }
    },
    createLink(linkedPageId) {
      fetch('http://localhost:5000/1/1/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page_id: this.selectedPage.id,
          linked_page_id: linkedPageId,
          linkage: 1
        })
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Could not save data!');
        }
        this.loadNote();
        this.loadEdge();
      }).catch((error) => {
        console.log(error)
      });
    },
    deleteLink(linkedPageId) {
      // 페이지 간 링크 삭제
      // POST: http://localhost:5000/1/1/delete-link
      fetch('http://localhost:5000/1/1/delete-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page_id: this.selectedPage.id,
          linked_page_id: linkedPageId
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Could not save data!');
        }
        this.loadNote();
        this.loadNode();
        this.loadEdge();
      }).catch((error) => {
        console.log(error)
      });
    },
    updateLink() {
      const identifiedNode = this.nodes.find(node => node.keyword === this.selectedPage.linkedPageKeyword);  // 검색한 키워드가 존재하는지?
      const identifiedEdge = this.edges.find(edge => edge.page_id === this.selectedPage.id);  // 기존의 link가 존재하는지?

      if (this.selectedPage.id === identifiedNode.page_id) {
        alert('Unable to link');
        if (identifiedEdge) {
          const nodeInfo = this.nodes.find(node => node.page_id === identifiedEdge.linked_page_id);
          this.selectedPage['linkedPageKeyword'] = nodeInfo.keyword;
        } else {
          this.selectedPage['linkedPageKeyword'] = '';
        }
      }

      if (this.selectedPage.linkedPageKeyword === '' || !this.selectedPage.linkedPageKeyword) {
        if (identifiedEdge) {
          this.deleteLink(identifiedEdge.linked_page_id);
        }
        return;
      }

      if (!identifiedNode) {
        alert('not exist');

        if (identifiedEdge) {
          const nodeInfo = this.nodes.find(node => node.page_id === identifiedEdge.linked_page_id);
          this.selectedPage['linkedPageKeyword'] = nodeInfo.keyword;
        } else {
          this.selectedPage['linkedPageKeyword'] = '';
        }
        return;
      } else {
        if (identifiedEdge) {
          this.deleteLink(identifiedEdge.linked_page_id);
        }
        this.createLink(identifiedNode.page_id);
      }
    },
    changeGraph() {
      if (!this.pageIsSelected) { return; }
      this.pageIsSelected = 'graph';
    },
    loadNote() {
      // 노트 안의 페이지 리스트 확인
      // GET: http://localhost:5000/1/1/page-list
      fetch('http://localhost:5000/1/1/page-list').then((response) => {
        if (response.ok) {
          return response.json()
        }
      }).then((data) => {
        this.notes = data.page_list;
        // console.log(data);
      }).catch((error) => {
        console.log(error)
      });
    },
    loadNode() {
      // 페이지 간 링크의 노드 확인
      // GET: http://localhost:5000/1/1/node
      fetch('http://localhost:5000/1/1/node').then((response) => {
        if (response.ok) {
          return response.json()
        }
      }).then((data) => {
        // this.nodes = data.node;

        for (var idx in data.node) {
          var node = {
            page_id: data.node[idx].page_id,
            keyword: data.node[idx].keyword
          }
          this.nodes.push(node);
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    loadEdge() {
      // 페이지 간 링크의 엣지 확인
      // GET: http://localhost:5000/1/1/edge
      fetch('http://localhost:5000/1/1/edge').then((response) => {
        if (response.ok) {
          return response.json()
        }
      }).then((data) => {
        // this.edges = data.edge;

        for (var idx in data.edge) {
          var edge = {
            page_id: data.edge[idx].page_id,
            linked_page_id: data.edge[idx].linked_page_id,
            linkage: data.edge[idx].linkage
          }
          this.edges.push(edge);
        }

      }).catch((error) => {
        console.log(error)
      });
    },
    addPage() {
      // 페이지 생성
      // POST: http://localhost:5000/1/1/create-page
      fetch('http://localhost:5000/1/1/create-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Could not save data!');
        }
        this.loadNote();
        this.loadNode();
      }).catch((error) => {
        console.log(error)
      });
    },
    deletePage() {
      // 페이지 삭제
      // POST: http -v post :5000/1/1/delete-page
      fetch('http://localhost:5000/1/1/delete-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page_id: this.selectedPage.id,
        })
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Could not save data!');
        }
        this.loadNote();
        this.loadNode();
        this.loadEdge();
        this.pageIsSelected = null;
      }).catch((error) => {
        console.log(error)
      });
    },
    changePageHeader() {
      fetch('http://localhost:5000/1/1/update-page-header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page_id: this.selectedPage.id,
          title: this.selectedPage.title,
          keyword: this.selectedPage.keyword
        })
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Could not save data!');
        }
        this.loadNote();
        this.loadNode();
      }).catch((error) => {
        console.log(error)
      });
    },
    changePageContent() {
      // 페이지 컨텐츠 수정 (content)
      // POST: http://localhost:5000/1/1/update-page-content
      fetch('http://localhost:5000/1/1/update-page-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page_id: this.selectedPage.id,
          content: this.selectedPage.content
        })
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Could not save data!');
        }
        this.loadNote();
      }).catch((error) => {
        console.log(error)
      });
    },
    async showGraph() {
      // 노드와 엣지를 불러오기 위한 API 엔드포인트
      const nodesEndpoint = 'http://localhost:5000/1/1/node';
      const edgesEndpoint = 'http://localhost:5000/1/1/edge';

      // 각각의 엔드포인트에서 데이터를 불러옵니다
      const nodesResponse = await axios.get(nodesEndpoint);
      const edgesResponse = await axios.get(edgesEndpoint);

      // API 응답을 적절한 형식으로 변환합니다
      this.nodeList = nodesResponse.data.node.map(node => ({
        data: { id: node.keyword }
      }));

      // page_id를 키워드로 변환하기 위한 맵을 생성합니다.
      const pageIdToKeyword = nodesResponse.data.node.reduce((acc, node) => {
        acc[node.page_id] = node.keyword;
        return acc;
      }, {});

      this.edgeList = edgesResponse.data.edge.map(edge => ({
        data: {
          id: `edge-${edge.page_id}-${edge.linked_page_id}`,
          source: pageIdToKeyword[edge.page_id],
          target: pageIdToKeyword[edge.linked_page_id]
        }
      }));
      
      let elements = this.nodeList.concat(this.edgeList);

      // const node = this.nodes.map(n => ({
      //   data: { id: n.keyword }
      // }));

      // const pageIdToKeyword = this.nodes.reduce((acc, n) => {
      //   acc[n.page_id] = n.keyword;
      //   return acc;
      // }, {});

      // const edge = this.edges.map(e => ({
      //   data: {
      //     id: `${pageIdToKeyword[e.page_id]}-${pageIdToKeyword[e.linked_page_id]}`,
      //     source: pageIdToKeyword[e.page_id],
      //     target: pageIdToKeyword[e.linked_page_id]
      //   }
      // }));

      // const elements = [...node, ...edge];

      cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#666',
              label: 'data(id)',
            },
          },
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
            },
          },
        ],
        layout: {
          name: 'grid',
          rows: 3,
        },
      });
    }
  },
  mounted() {
    this.loadNote();
    this.loadNode();
    this.loadEdge();
  },
}
</script>

<style scoped>
.sidebar {
  font-size: .875rem;
  font-weight: 500;
  color: #2470dc;
}
</style>