const ConfirmModal = ({ text, canceltext, confirmtext, onCancel, onConfirm }) => {
  const stopClick = (event) => {
    event.stopPropagation()
  }
  return (
    <div>
      <div className="pointer-events-none fixed inset-0 bg-primary-500 transition-opacity"></div>

      <div className="pointer-events-auto absolute inset-0 overflow-hidden">
        <div
          onClick={stopClick}
          className="fixed left-1/2 top-1/2  w-72 max-w-full -translate-x-1/2 -translate-y-1/2 transform rounded-4xl bg-secondary px-4 py-6 text-center "
        >
          <p className="h1 mb-4">{text}</p>
          <div className=" flex justify-between gap-4">
            <button className="" onClick={onCancel}></button>
            <button className="" onClick={onConfirm}></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
