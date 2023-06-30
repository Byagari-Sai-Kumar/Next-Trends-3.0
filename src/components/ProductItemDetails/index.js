import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productsData: {},
    similarProductsData: [],
    quantity: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetailsData()
  }

  onClickQuantityDecreaseButton = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(
        prevState => ({
          quantity: prevState.quantity - 1,
        }),
        this.renderProductItemData,
      )
    }
  }

  onClickQuantityIncreaseButton = () => {
    this.setState(
      prevState => ({
        quantity: prevState.quantity + 1,
      }),
      this.renderProductItemData,
    )
  }

  renderProductItemData = () => {
    const {productsData, similarProductsData, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productsData

    return (
      <>
        <div className="productsItemsDetailsTopSection">
          <div className="titleImageContainer">
            <img src={imageUrl} alt="product" className="titleImage" />
          </div>
          <div className="detailsContainer">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="ratingsReviewContainer">
              <div className="starContainer">
                <p className="ratingNumber">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="ratingStar"
                />
              </div>
              <p className="totalReviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">Available : {availability}</p>
            <p className="availability">Brand : {brand}</p>
            <hr className="hrLine" />
            <div className="increaseDecreaseContainer">
              <button
                type="button"
                data-testid="minus"
                className="increaseButtonContainer"
                onClick={this.onClickQuantityDecreaseButton}
              >
                <BsDashSquare className="increaseDecreaseIcons" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                data-testid="plus"
                className="increaseButtonContainer"
                onClick={this.onClickQuantityIncreaseButton}
              >
                <BsPlusSquare className="increaseDecreaseIcons" />
              </button>
            </div>
            <button type="button" className="addToCartButton">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similarProductsHeading">Similar Products</h1>
        <ul className="similarProductsContainer">
          {similarProductsData.map(eachSimilarProduct => (
            <SimilarProductItem
              similarProduct={eachSimilarProduct}
              key={eachSimilarProduct.id}
            />
          ))}
        </ul>
      </>
    )
  }

  formatProductData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
  })

  getProductItemDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedProductData = this.formatProductData(data)
      const updatedSimilarProductsData = data.similar_products.map(eachItem =>
        this.formatProductData(eachItem),
      )

      this.setState({
        productsData: updatedProductData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      console.log('failed')
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="productsFailureImage"
      />
      <h1 className="productFailureHeading">Product Not Found</h1>
      <button
        type="button"
        className="continueShopping"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductItemDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProductItemData()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="productItemDetailsOverallContainer">
          {this.renderProductItemDetailsView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
