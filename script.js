let cart = [];
let modalQt = 1;
let modalKey = 0;

const dQ = (el) => document.querySelector(el);
const dQA = (el) => document.querySelectorAll(el);


pizzaJson.map( (item, index) => {
    let pizzaItem = dQ('.models .pizza-item').cloneNode(true);

    //alimentando a tela principal com os dados do pizzaJson na tela principal
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //botão de click para o modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault(); //previne q a tag não execute a sua função
        
        //identificando cada objeto pelo id 
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        //alimentando o modal com os dados de pizzaJson
        dQ('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        dQ('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        dQ('.pizzaBig img').src = pizzaJson[key].img;
        dQ('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //tratando animação de tela do select
        dQ('.pizzaInfo--size.selected').classList.remove('selected');
        dQA('.pizzaInfo--size').forEach((size, sizeIndex) =>{
            if(sizeIndex == 2) {
                size.classList.add('selected'); 
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });

        dQ('.pizzaInfo--qt').innerHTML = modalQt;

        //animaçao de surgimento do modal
        dQ('.pizzaWindowArea').style.opacity = 0;
        dQ('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            dQ('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

 
  
    dQ('.pizza-area').append( pizzaItem );
})

//eventos do modal
function closeModal() {
    dQ('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        dQ('.pizzaWindowArea').style.display = 'none';
    }, 500); 
}

dQA('.pizzaInfo--cancelButton', '.pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

dQ('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--;
        dQ('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

dQ('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    dQ('.pizzaInfo--qt').innerHTML = modalQt;
});

dQA('.pizzaInfo--size').forEach((size) =>{
    size.addEventListener('click', (e) => {
        dQ('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

dQ('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(dQ('.pizzaInfo--size.selected').getAttribute('data-key'));

    //identificador de id e size
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    
    updateCart();
    closeModal();
});

dQ('.menu-openner').addEventListener('click', () => {
     if(cart.length > 0) {
        dQ('aside').style.left = '0';
     }
});

dQ('.menu-closer').addEventListener('click', () => {
    dQ('aside').style.left = '100vw';
});

function updateCart() {
    dQ('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        dQ('aside').classList.add('show');
        dQ('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = dQ('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(cart[i].qt > 1) {
                cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();

            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            })

            dQ('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        dQ('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        dQ('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        dQ('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        dQ('aside').classList.remove('show');
        dQ('aside').style.left = '100vw'
    }

}