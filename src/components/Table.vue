<template>
  <table class="table table-bordered table-striped table-hover" v-if="result">
    <thead>
    <tr>
      <th @click="eventOrder(item)" v-for="item in fields">
        {{item}} <i class="bi bi-arrow-down"></i>
      </th>
      <th>Action</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, i) in data" :key="i">
      <td v-for="item2 in fields">{{item[item2]}}</td>
      <td>
        <p class="text-center" style="margin: 0px; padding: 0px;">
          <a class="btn btn-primary btn-sm" data-bs-toggle="modal" id="linkModal" data-bs-target="#exampleModal" @click.prevent="eventModal(item.name)">
            <i class="bi bi-justify"></i> Show more details
          </a>
        </p>
      </td>
    </tr>
    </tbody>
  </table>
</template>
<script>
export default{
  props:{
    fields:Array,
    result:{
      type:Object,
      default:{}
    },
    data:{
      type:Array,
      default:[]
    }
  },
  setup(props, {emit}){
    function eventModal(name){
      emit('eventModal', name)
    }

    function eventOrder(field){
      emit('eventOrder', field)
    }

    return {eventModal, eventOrder}
  }
}
</script>