<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">

        <Modal :title="'list of characters'" :infoForModal="infoForModal">
          <b>Name</b>: {{ infoForModal.name || '' }} <br>
          <b>Specie</b>: {{ infoForModal.species || '' }} <br>
          <b>Origin</b>: {{ infoForModal.origin? infoForModal.origin.name : '' }} <br>
          <b>Gender</b>: {{ infoForModal.gender || '' }} <br>
          <b>Status</b>: {{ infoForModal.status || '' }} <br><br>
          <b>Episodes that participated</b><br>
          <hr>

          <ul style="list-style:none;" v-if="infoForModal.episode">
            <li v-for="item in infoForModal.episode">
              <i class="bi bi-play-btn-fill"></i>  {{ item.name }}
            </li>
          </ul>
        </Modal>

        <h3 class="mb-4 text-center">List of characters</h3>

        <input type="text" v-model="wordSearch" placeholder="Search by name" class="form-control mb-2">

        <Table
            :fields="['name', 'species', 'gender']"
            @eventOrder="changeSort($event)"
            :result="result"
            :data="characters"
            @eventModal="getInfoModal($event)"
        />

      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, onMounted, watch } from 'vue'
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
        characters{
          results{
            name
            species
            gender
            status
            episode{
              name
            }
            origin{
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

    let characters = computed(()=>{
      if(result.value){
        if(wordSearch.value.length) {
          return result._value.characters.results.filter(item => item.name.toLowerCase().indexOf(wordSearch.value.toLowerCase()) != -1)
        }else if(sort.value.fields){
          return _.orderBy(result._value.characters.results, sort.value.fields, sort.value.order);
        }
        else{
          return result._value.characters.results
        }
      }else{
        return []
      }
    })


    function getInfoModal(name){
      infoForModal.value = characters.value.filter(item=>item.name==name)[0]
    }

    return {result, characters, getInfoModal, infoForModal, changeSort, wordSearch}
  },
}
</script>