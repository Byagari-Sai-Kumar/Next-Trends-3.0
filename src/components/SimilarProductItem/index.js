import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props
  const {imageUrl, title, brand, price, rating} = similarProduct

  return (
    <li className="similarProductListItem">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similarImage"
      />
      <h1 className="similarTitle">{title}</h1>
      <p className="similarAuthor">by {brand}</p>
      <div className="similarRateAndRatingContainer">
        <p className="similarPrice">Rs {price}/-</p>
        <div className="ratingContainer">
          <p className="ratingNumber">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="ratingStar2"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
