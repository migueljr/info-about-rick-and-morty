<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">

        <Modal :title="'list of episodes'" :infoForModal="infoForModal">
          <b>Name</b>: {{ infoForModal.name || '' }} <br>
          <b>Specie</b>: {{ infoForModal.air_date || '' }} <br>
          <b>Participated in the episode</b><br>
          <hr>

          <ul style="list-style:none;" v-if="infoForModal.characters">
            <li v-for="item in infoForModal.characters">
              <i class="bi bi-person-check"></i> {{ item.name }}
            </li>
          </ul>
        </Modal>

        <h3 class="mb-4 text-center">List of episodes</h3>

        <input type="text" v-model="wordSearch" placeholder="Search by name" class="form-control mb-2">

        <Table
            :fields="['name']"
            @eventOrder="changeSort($event)"
            :result="result"
            :data="episodes"
            @eventModal="getInfoModal($event)">
        </Table>

      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import _ from 'lodash'

import Modal from '../components/Modal'
import Table from "../components/Table";

export default {

  components:{
    Table,
    Modal
  },

  setup () {
    const {result} = useQuery(gql`
      query {
        episodes{
          results{
            name
            air_date
            characters{
              name
            }
          }
        }
      }
    `);


    const sort = ref({
      fields:[],
      order:[]
    })
    const infoForModal = ref({})
    const wordSearch = ref('')


    function changeSort (field = null){
      if(field){
        sort.value.fields[0] = field
        if(!sort.value.order[0]) {
          sort.value.order[0] = 'asc'
        }else{
          sort.value.order[0] == 'asc' ? sort.value.order[0] = 'desc' : sort.value.order[0] = 'asc'
        }
      }
    }

    let episodes = computed(()=>{
      if(result.value){
        if(wordSearch.value.length) {
          return result._value.episodes.results.filter(item => item.name.toLowerCase().indexOf(wordSearch.value.toLowerCase()) != -1)
        }else if(sort.value.fields){
          return _.orderBy(result._value.episodes.results, sort.value.fields, sort.value.order);
        }
        else{
          return result._value.episodes.results
        }
      }else{
        return []
      }
    })


    function getInfoModal(name){
      infoForModal.value = episodes.value.filter(item=>item.name==name)[0]
    }

    return {result, episodes, getInfoModal, infoForModal, changeSort, wordSearch}
  },
}
</script>