import './styles.less'

// eslint-disable-next-line react/prop-types
function Loader({ loading }) {
  return (
    <div className={`loading-page ${loading ? '' : 'hidden'}`}>
      <div className="loading-ball bounce1" />
      <div className="loading-ball bounce2" />
      <div className="loading-ball bounce3" />
    </div>
  )
}

export default Loader
