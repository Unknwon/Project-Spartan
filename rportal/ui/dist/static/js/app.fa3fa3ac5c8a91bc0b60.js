webpackJsonp([1],{0:function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n("/5sW"),s=n("8+8L"),o={name:"App",data:function(){return{items:[],newItem:{}}},created:function(){this.$http.get("/api/items").then(function(e){this.items=e.data?e.data:[]})},methods:{createItem:function(){this.$http.post("/api/items",this.newItem).then(function(e){this.newItem.id=e.data.id,this.items.push(this.newItem),this.newItem={}},function(){alert("Something went wrong on the server!")})},deleteItem:function(e){this.$http.delete("/api/items/"+e.id).then(function(t){this.items.splice(e,1)},function(){alert("Something went wrong on the server!")})}}},a={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[e._m(0),e._v(" "),n("table",{attrs:{border:"1"}},[e._m(1),e._v(" "),n("tbody",e._l(e.items,function(t){return n("tr",{key:t.id},[n("td",[e._v(e._s(t.id))]),e._v(" "),n("td",[e._v(e._s(t.name))]),e._v(" "),n("td",[e._v(e._s(t.person))]),e._v(" "),n("td",[e._v(e._s(t.phone))]),e._v(" "),n("td",[e._v(e._s(t.address))]),e._v(" "),n("td",[n("a",{attrs:{href:"#"},on:{click:function(n){e.deleteItem(t)}}},[e._v("Delete")])])])}))]),e._v(" "),n("br"),n("br"),e._v(" "),n("table",{attrs:{border:"1"}},[n("tbody",[n("tr",[n("th",[e._v("Reseller Name:")]),e._v(" "),n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.newItem.name,expression:"newItem.name"}],attrs:{type:"text"},domProps:{value:e.newItem.name},on:{input:function(t){t.target.composing||e.$set(e.newItem,"name",t.target.value)}}})])]),e._v(" "),n("tr",[n("th",[e._v("Contact Person:")]),e._v(" "),n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.newItem.person,expression:"newItem.person"}],attrs:{type:"text"},domProps:{value:e.newItem.person},on:{input:function(t){t.target.composing||e.$set(e.newItem,"person",t.target.value)}}})])]),e._v(" "),n("tr",[n("th",[e._v("Phone Number:")]),e._v(" "),n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.newItem.phone,expression:"newItem.phone"}],attrs:{type:"text"},domProps:{value:e.newItem.phone},on:{input:function(t){t.target.composing||e.$set(e.newItem,"phone",t.target.value)}}})])]),e._v(" "),n("tr",[n("th",[e._v("Business Address:")]),e._v(" "),n("td",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.newItem.address,expression:"newItem.address"}],attrs:{type:"text"},domProps:{value:e.newItem.address},on:{input:function(t){t.target.composing||e.$set(e.newItem,"address",t.target.value)}}})])])])]),e._v(" "),n("button",{on:{click:e.createItem}},[e._v("Add New Reseller")])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("h1",[this._v("Reseller Portal "),t("sub",[this._v("Project Spartan")])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("thead",[n("tr",[n("th",[e._v("ID")]),e._v(" "),n("th",[e._v("Reseller Name")]),e._v(" "),n("th",[e._v("Contact Person")]),e._v(" "),n("th",[e._v("Phone Number")]),e._v(" "),n("th",[e._v("Business Address")]),e._v(" "),n("th",[e._v("Action")])])])}]};var i=n("VU/8")(o,a,!1,function(e){n("W+ek")},null,null).exports;r.a.config.productionTip=!1,r.a.use(s.a),new r.a({el:"#app",render:function(e){return e(i)}})},"W+ek":function(e,t){}},["NHnr"]);