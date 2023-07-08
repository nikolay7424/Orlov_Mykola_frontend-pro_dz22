const products = [
    {
        title: "Футболки",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/t-shirt.jpg",
    },
    {
        title: "Худі",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/hoodie.jpg",
    },
    {
        title: "Джинси",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/jeans.jpg",
    },
    {
        title: "Кросівки",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/sneakers.jpg",
    },
    {
        title: "Головні убори",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/hats.jpg",
    },
]

const categories = document.querySelector('.categories')
const productsDiv = document.querySelector('.products')
const cart = document.querySelector('.cart')
const notification = document.querySelector('.notification')

// modal vars
const modal = document.querySelector('dialog')
const nameIput = modal.querySelector('#name')
const departmentIput = modal.querySelector('#department')
const textInputs = Array.from(modal.querySelectorAll('input[type=text]'))
const select = modal.querySelector('select')
const radio = Array.from(modal.querySelectorAll('input[type=radio]'))
const radioWrapper = modal.querySelector('.radio-wrapper')
const form = modal.querySelector('form')
const quantity = modal.querySelector('#quantity')
const comment = modal.querySelector('#comment')
const inputsArr = [nameIput, departmentIput, select, radioWrapper]
const allInputsArr = [nameIput, departmentIput, select, radioWrapper, quantity, comment]


categories.addEventListener('click', caterogiesHandler)
productsDiv.addEventListener('click', productstHandler)
window.addEventListener('click', buttonHandler)

// modal listeners
// textInputs.forEach(input => {
//     input.addEventListener('keyup', validateTextInput(input))
// })
nameIput.addEventListener('keyup', function() {
    validateTextInput(nameIput)
})
departmentIput.addEventListener('keyup', function() {
    validateTextInput(departmentIput)
})
select.addEventListener('change', function() {
    validateSelect(select)
})

radioWrapper.addEventListener('click', function(){
    validateRadio(radio)
})

function caterogiesHandler(e) {
    if(productsDiv.children[0]) {
        productsDiv.innerHTML = ''
        cart.innerHTML = ''
    }
    products.forEach(product => {
        if(e.target.textContent === product.title) {
            for(let i = 0; i < 6; i++) {
                const productDiv = createProductDiv(
                    product.title, 
                    product.description, 
                    product.image)
                productsDiv.appendChild(productDiv)
            }
        }
    })
}

function productstHandler(e) {
    if(cart.children[0]) {
        cart.innerHTML = ''
    }
    if(e.target.classList.contains('product')) {
        const button = document.createElement('button')
        button.textContent = 'Купити'
        button.classList.add('btn')
        const productDiv = createProductDiv(
            e.target.children[1].textContent, 
            e.target.children[2].textContent, 
            e.target.children[0].src, 
            button)
        cart.appendChild(productDiv)
    }
}

function createProductDiv(title, description, img, button = null) {
    const productDiv = document.createElement('div')
    productDiv.classList.add('product')

    const productImg = document.createElement('img')
    productImg.src = img

    const procutTitle = document.createElement('h2')
    procutTitle.classList.add('product-name')
    procutTitle.textContent = title

    const procutDescription = document.createElement('p')
    procutDescription.classList.add('product-description')
    procutDescription.textContent = description

    
    productDiv.appendChild(productImg)
    productDiv.appendChild(procutTitle)
    productDiv.appendChild(procutDescription)
    if(button) {
        productDiv.appendChild(button)
    }
    return productDiv
}

function buttonHandler(e) {
    if(e.target.classList.contains('btn')) {
        e.preventDefault()
        modal.showModal()
        modal.addEventListener('click', modalHandler)
    }
}

// modal functions
function modalHandler(e) {
    const modalDimentions = modal.getBoundingClientRect();
    if(
        e.clientX < modalDimentions.left ||
        e.clientX > modalDimentions.right ||
        e.clientY < modalDimentions.top ||
        e.clientY > modalDimentions.bottom
        ) {
        modal.close();
        modal.removeEventListener('click', modalHandler)
    }

    if(e.target.classList.contains('submit')) {
        e.preventDefault()
        if(validateTextInput(nameIput) 
        && validateSelect(select) 
        && validateTextInput(departmentIput) 
        && validateRadio(radio)) {
            productsDiv.innerHTML = ''
            cart.innerHTML = ''
            const orderTable = createOrderTable()
            productsDiv.appendChild(orderTable)
            modal.close()
            modal.removeEventListener('click', modalHandler)
            formReset()
        }
    }
}

function createOrderTable() {
    const table = document.createElement('table')
    const orderTitle = document.createElement('th')
    orderTitle.textContent = 'Ваше замовлення:'
    table.appendChild(orderTitle)
    allInputsArr.forEach(input => {
        switch(input.type) {
            case('text') :
            case('number') :
            case('textarea') :
                createTableRow(input.previousElementSibling.textContent, input.value, table)
                break
            case('select-one') :
                for(let option of input) {
                    if(option.selected === false) {
                        continue
                    } else {
                        createTableRow(input.previousElementSibling.textContent, option.textContent, table)    
                    }
                    break
                }
            }
        })
        for(let radioInput of radio) {
            if(radioInput.checked === false) {
                continue
            } else {
                createTableRow(radioInput.parentElement.parentElement.previousElementSibling.textContent, radioInput.nextElementSibling.textContent, table)    
            }
            break
        }
    return table
}

function createTableRow(key, value, appendTo) {
    const tr = document.createElement('tr')
    const tdKey = document.createElement('td')
    tdKey.textContent = key
    const tdValue = document.createElement('td')
    tdValue.textContent = value
    tr.appendChild(tdKey)
    tr.appendChild(tdValue)
    appendTo.appendChild(tr)
}

function validateTextInput(element) {
    if(element.value.length === 0) {
        const message = 'поле не може бути пустим'
        showErrorMessage(element, message, 'red')
        return false
    } else if(element.value.length < 2) {
        const message = 'поле повинно мати хочаб 2 символи'
        showErrorMessage(element, message, 'red')
        return false
    } else {
        const message = ' '
        showErrorMessage(element, message, '#0ea50e')
        return true
    }
}

function validateSelect(element) {
    for(let option of Array.from(element.children)) {
        if(option.value == '' && option.selected) {
            const message = 'оберіть місто будь ласка'
            showErrorMessage(element, message, 'red')
            return false
        } else {
            const message = ' '
            showErrorMessage(element, message, '#0ea50e')
            return true
        }
    }
}

function validateRadio(radioArr) {
    let validated = false
    for(let radioEl of radioArr) {
        if(radioEl.checked) {
            const message = ' '
            showErrorMessage(radioWrapper, message, '#0ea50e')
            validated = true
            return true
        } else {
            const message = 'оберіть спосіб оплати будь ласка'
            showErrorMessage(radioWrapper, message, 'red')
            validated = false
        }
    }
    return validated
}

function showErrorMessage(element, message, color) {
    element.nextElementSibling.textContent = message
    element.nextElementSibling.style.color = color
    element.style.borderColor = color
}

function formReset() {
    form.reset()
    inputsArr.forEach(element => {
        showErrorMessage(element, ' ', 'black')
    });
}