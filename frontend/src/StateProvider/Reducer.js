export const initialState = {
    user: '',
    rawdata: [],
    home_products: [],
    cart: [],
    cartTotal: 0,
    cart_pending: '',
    attributes: [],
    orders: [],
    vendorOrders: [],
    currentOrder: []
};

const reducer = (store, action) => {
    // console.log(action)
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...store,
                user: action.data
            }

        case 'ADD_TO_CART':
            {
                var price = 0
                if (action.item.item.productType == 0) {
                    price = store.cartTotal + parseInt(action.item.item.price.price)
                } else if (action.item.item.productType == 1) {
                    price = store.cartTotal + parseInt(action.item.item.varient.general.price)
                }
                return {
                    ...store,
                    cart: [...store.cart, action.item],
                    cartTotal: price
                }
            }


        case 'SET_CART':
            {
                var price = 0
                action.items.map(item => (
                    item.productType == 0 ?
                        price += parseInt(item.price.price)
                        : item.productType == 1 ?
                            price += parseInt(item.varient.general.price)
                            : price += 0
                ))
                return {
                    ...store,
                    cart: action.items,
                    cartTotal: price
                }


            }

        case 'CART_PENDING':
            // console.log('store', action.item)
            return {
                ...store,
                cart_pending: action.item
            }


        case 'ADD_TO_ORDERS':
            return {
                ...store,
                orders: [...store.orders, action.cart]
            }

        case 'SET_ORDERS':
            return {
                ...store,
                orders: action.orders
            }

        case 'SET_CURRENT_ORDER':
            return {
                ...store,
                currentOrder: action.order
            }

        case 'SET_VORDERS':
            return {
                ...store,
                vendorOrders: action.orders
            }


        case 'ADD_TO_RAWDATA':
            return {
                ...store,
                rawdata: action.data
            }

        case 'SET_ATTR':
            return {
                ...store,
                attributes: action.data
            }

        case 'ADD_TO_HOME_PRODUCTS':
            return {
                ...store,
                home_products: [...store.home_products, action.data.products]
            }

        default:
            return store
    }
}

export default reducer