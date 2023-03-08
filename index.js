const $wrapper = document.querySelector('[data-wrapper]')
const $currentEx = document.querySelector('[data-current-ex]')
const $addBtn = document.querySelector('[data-add_button]')
const $modalAdd = document.querySelector('[data-modal-add]')
const $modalEx = document.querySelector('[data-modal-ex]')
const $spinner = document.querySelector('[data-spinner]')
const $formErrorMsg = document.querySelector('[data-errmsg]')
const $modalClose = document.querySelector('.modalClose');
const $modalCloseForm = document.querySelector('.modalCloseForm');
const $modalEdit = document.querySelector('[data-modal-edit]')
const $inputEdit = document.querySelectorAll(".edit");
const $btnWrapper = document.querySelector('[btn-wrapper]');

  console.log($inputEdit);

const HIDDEN_CLASS = 'hidden'

const generateCatCard = (cat) => {

  if (cat.image =="") {cat.image = "img/pet.jpg"};
  if (cat.name =="") {cat.name = "У красавца нет имени"};

  return (
  
   `<div class="col">
      <div data-card_id=${cat.id} class="card shadow-sm">
     <div class="card-top"  >
      <img
      src="${cat.image}"
      class="card-img-top"
      alt="фото кота ${cat.name}"
       width="100%"
       /> </div>
        <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title">${cat.name}</h5>
        <small class="text-muted"><div class="${cat.favorite}" data-action="love" data-like ="favorite"></div></small>
        </div>
          <p class="card-text">Возраст: ${cat.age}</p>
          <p class="card-text">Ядовитость: ${cat.rate} из 10</p>
          <div class="d-flex justify-content-between align-items-center card-btn">
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button"  data-action="open" class="btn btn-sm btn-outline-success">Смотреть</button>
              <button type="button" data-action="edit"  class="btn btn-sm btn-outline-warning">Редактировать</button>
              <button type="button"  data-action="delete"  class="btn btn-sm  btn-outline-danger">Удалить</button>
            </div>
            
          </div>
        </div>
      </div>
    </div>`
  )
}

const generateCatCardinModal = (cat) => {    // зверь в модельном окне

  if (cat.image =="") {cat.image = "img/pet.jpg"};
  if (cat.name =="") {cat.name = "У красавца нет имени"};



  return (
  
   `
      <div data-card_id=${cat.id} class="card shadow-sm">
     
      <img
      src="${cat.image}"
      class="card-img-top"
      alt="фото  ${cat.name}"
      height = "250px";
       /> 
        <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
        <h5 class="card-title">${cat.name}</h5>
        
        </div>
          <p class="card-text">Возраст: ${cat.age}</p>
          <p class="card-text">Ядовитость: ${cat.rate} из 10</p>
          <p class="card-text">Описание: ${cat.description}</p>
          
        </div>
      </div>
    `
  )
}




$wrapper.addEventListener('click', async (event) => {
  const action = event.target.dataset.action;
  if (event.target === $wrapper ) return;

  const $currentCard = event.target.closest('[data-card_id]');
  const catId = $currentCard.dataset.card_id;
  console.log(typeof catId)

  switch (action) {
    case 'delete':              // удалить зверя
      
      try {
        const res = await api.deleteCat(catId);
        const responce = await res.json();
        if (!res.ok) throw Error(responce.message)
        $currentCard.remove()
      } catch (error) {
        console.log(error);
      }
      break;

    case 'open':               // открыть зверя в модальном окне
      console.log(1);
      $modalEx.classList.remove(HIDDEN_CLASS);
      const getCatFunc = async () => {

        const res = await api.getCurrentCat(catId);
        console.log(res);
      
        if (res.status !== 200) {
          const $errorMessage = document.createElement('p');
          $errorMessage.classList.add('error-msg');
          $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';
      
          return $wrapper.appendChild($errorMessage);
        }
      
         const cat = await res.json();
      
         console.log(cat);

         $currentEx.innerHTML = generateCatCardinModal(cat);

         
      }
      
      getCatFunc();
      break;

    case 'edit':                                 // редактировать зверя 
      $modalEdit.classList.remove(HIDDEN_CLASS); // открываем модалку
      const editCatFunc = async () => {

        const res = await api.getCurrentCat(catId);
        console.log(res);
      
        if (res.status !== 200) {
          const $errorMessage = document.createElement('p');
          $errorMessage.classList.add('error-msg');
          $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';
      
          return $wrapper.appendChild($errorMessage);
        }
      
        const cat = await res.json();
      
        console.log(cat);

        $inputEdit[0].value = cat.id;
        $inputEdit[1].value = cat.name;
        $inputEdit[2].value = cat.image;
        $inputEdit[3].value = cat.age;
        $inputEdit[4].value = cat.rate;
        $inputEdit[5].value = cat.description;

      }
      editCatFunc();
      break;

    case 'love':
       
      if (event.target.className === 'false') {
          event.target.className = 'true'
      } else {
          event.target.className = 'false'
      }
        
     $formErrorMsg.innerText = '';

     const data = {};
     if (event.target.className === "true"){
     data.favorite = true
     } else {
     data.favorite = false
     }

     id = Number(catId);
     
     const res = await api.editCat(data, id)

     if (res.status !== 200) {
     const $errorMessage = document.createElement('p');
     $errorMessage.classList.add('error-msg');
     $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';
     return $wrapper.appendChild($errorMessage);
     }   
      break;
    default:
      break;
  }
})


$btnWrapper.addEventListener('click', async (event) => { //верхнее меню с кнопками
  const action = event.target.dataset.action;

  switch (action) {                                       
    case 'add':                                          //добавить зверя
      $modalAdd.classList.remove(HIDDEN_CLASS)
      break;

    case 'showlove':                                      //показать только любимчиков
      if ($wrapper.innerHTML !== ""){
        $wrapper.innerHTML = "";
        }
      const getLoveCatsFunc = async () => {

        const res = await api.getAllCats();
      
        if (res.status !== 200) {
          const $errorMessage = document.createElement('p');
          $errorMessage.classList.add('error-msg');
          $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';
      
          return $wrapper.appendChild($errorMessage);
        }
      
         const data = await res.json();
      
        if (data.length === 0) {
          const $notificationMessage = document.createElement('p');
          $notificationMessage.innerText = 'Список пуст, добавьте животное';
      
          return $wrapper.appendChild($notificationMessage);
        }
      
          
         data.forEach(cat => { if (cat.favorite == true) {
           $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))}
         });
        
      }
       getLoveCatsFunc();
      
      break;

    case 'sortrate':                                       //отсортировать по ядовитости (рейтингу)
     if ($wrapper.innerHTML !== ""){
        $wrapper.innerHTML = "";
        }

      const sortCatsFunc = async () => {

      const res = await api.getAllCats();
    
      if (res.status !== 200) {
        const $errorMessage = document.createElement('p');
        $errorMessage.classList.add('error-msg');
        $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';
    
        return $wrapper.appendChild($errorMessage);
      }
    
      const data = await res.json();
    
      if (data.length === 0) {
        const $notificationMessage = document.createElement('p');
        $notificationMessage.innerText = 'Список пуст, добавьте животное';
    
        return $wrapper.appendChild($notificationMessage);
      }
    
      data.sort((prev, next) => prev.rate - next.rate);
      data.forEach(cat => { 
          $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
        });
      
    }
    sortCatsFunc();

      break;
    
    case 'showall':                        //показать всех зверей
    if ($wrapper.innerHTML !== ""){
      $wrapper.innerHTML = "";
      }                                        
    getCatsFunc();
     break;
    
     default:
      break;

  }
})



document.forms.add_cats_form.addEventListener('submit', async (event) => {   //форма для добавления зверя
  event.preventDefault();
  $formErrorMsg.innerText = '';

  const data = Object.fromEntries(new FormData(event.target).entries());

  data.id = Number(data.id)
  data.age = Number(data.age)
  data.rate = Number(data.rate)
  data.favorite = data.favorite == 'on'

  const res = await api.addNewCat(data)

  if (res.ok) {
    $wrapper.replaceChildren();
    getCatsFunc()
    $modalAdd.classList.add(HIDDEN_CLASS)
    return event.target.reset()
  } else {
    const responce = await res.json();
    $formErrorMsg.innerText = responce.message
    return;
  }
})


$modalCloseForm.addEventListener('click', () => {                           
  $modalAdd.classList.add(HIDDEN_CLASS)
})

$modalClose.addEventListener('click', () => {
  $modalEx.classList.add(HIDDEN_CLASS);
})



document.forms.edit_cats_form.addEventListener('submit', async (event) => {   //форма для редактирования зверя
  event.preventDefault();
  $formErrorMsg.innerText = '';

  const data = Object.fromEntries(new FormData(event.target).entries());

  id = Number(data.id);
  data.age = Number(data.age);
  data.rate = Number(data.rate);
  delete data.id;
  

  const res = await api.editCat(data, id)

  if (res.ok) {
    $wrapper.replaceChildren();
    getCatsFunc()
    $modalEdit.classList.add(HIDDEN_CLASS)
    return event.target.reset()
  } else {
    const responce = await res.json();
    $formErrorMsg.innerText = responce.message
    return;
  }
})


const getCatsFunc = async () => {                    //все звери на странице

  const res = await api.getAllCats();

  if (res.status !== 200) {
    const $errorMessage = document.createElement('p');
    $errorMessage.classList.add('error-msg');
    $errorMessage.innerText = 'Произошла ошибка, попробуйте выполнить запрос позже';

    return $wrapper.appendChild($errorMessage);
  }

  const data = await res.json();

  if (data.length === 0) {
    const $notificationMessage = document.createElement('p');
    $notificationMessage.innerText = 'Список пуст, добавьте животное';

    return $wrapper.appendChild($notificationMessage);
  }


  setTimeout(() => {
    $spinner.classList.add(HIDDEN_CLASS)
    data.forEach(cat => {
      $wrapper.insertAdjacentHTML('afterbegin', generateCatCard(cat))
    });
  }, 1000);
}
getCatsFunc();


