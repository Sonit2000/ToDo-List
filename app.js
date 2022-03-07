// SELECT ITEMS 
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container =document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn')
//edt option]
let editElement;
let editFlag= false;
let editID="";
// *******EVENT lISTENERS******
// submit form 
form.addEventListener('submit',addItem)
// clear Item
clearBtn.addEventListener("click",clearItem)
window.addEventListener("DOMContentLoaded",setUpItem)
// *******FUNCTION*******
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if(value  && !editFlag){
        creatItems(id,value);
        displayAlert('item added to the list','success');
        // show container
        container.classList.add("show-container");
        // add to local storage
        addLocalStorage(id,value);
        //set back to default
        setBackToDefault();                                           
    }   
    else if(value  && editFlag){
        editElement.innerHTML =value;
        editLocalStorage(editID,value)
        displayAlert('Change success','success');
        
    }
    else{
        displayAlert('Please enter value',"danger")
    }
}
// display alert
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(()=>{
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    },1000)
}
// clear item
function clearItem(){
    const items = document.querySelectorAll('grocery.item');
    if(items.length>0){
        items.forEach(function(item){
            list.removeChild(item)
        })
    }
    container.classList.remove("show-container");
    displayAlert("empty List","danger");
    setBackToDefault();
    localStorage.removeItem("list");
}
// edit value
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement= e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}
function delItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    list.removeChild(element);
    removeFormLocalStorage(element.dataset.id);
    if(list.children.length === 0){
        container.classList.remove('show-container')
    }
}
// set back to default
function setBackToDefault(){
    grocery.value= '';
    editFlag= false;
    editID='';
    submitBtn.textContent = 'submit';
}
//*******LOCAL STORAGE*******
function addLocalStorage(id,value){
    const grocery ={id,value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem('List',JSON.stringify(items));
}
function removeFormLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(item=>{
        if(item.id === id ){
            return item;
        }
    })
    localStorage.setItem('List',JSON.stringify(items));
}
function editLocalStorage(id,value){
    let items = getLocalStorage();
    items.map(item=>{
        if(item.id===id){
            item.value = value;
        }
        return item;
    })
    localStorage.setItem('List',JSON.stringify(items));
}
function getLocalStorage(){
    return localStorage.getItem('List') ? JSON.parse(localStorage.getItem('List')): [];
}

// *******SETUP ITEMS*******
function setUpItem(){
    let items = getLocalStorage();
    if(items.length >0){
        items.forEach(item=>{
            creatItems(item.id,item.value);
        })
        container.classList.add('show-container');
    }
}
function creatItems(id,value){
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id 
    const  attr= document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML= ` <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    const editBtn = element.querySelector('.edit-btn');
    const deleteBtn = element.querySelector('.delete-btn');
    editBtn.addEventListener('click',editItem);
    deleteBtn.addEventListener('click',delItem);
    list.appendChild(element);
}