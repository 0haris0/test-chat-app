// @ts-check
const TypingArea = ({message, setMessage, onSubmit, spamProtect}) => (
  <div className="p-3 chat-input-section">
      {spamProtect ? <div className={"alert alert-danger"}>Spam protection is on! <br/><small>You need to wait 10 sec. to be able sending messages</small></div> : null}
      <form className="row no-gutters" onSubmit={onSubmit}>
          <div className="col-9">
        <div className="position-relative">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Enter Message..."
            className="form-control chat-input"
            disabled={spamProtect}
          />
          {/**/}
        </div>
      </div>
          <div className="col-3">
        <button
          type="submit"
          className="btn btn-primary btn-rounded chat-send float-right"
          disabled={spamProtect}
        >
          <span className="d-none d-sm-inline-block mr-2">Send</span>
          <svg width={13} height={13} viewBox="0 0 24 24" tabIndex={-1}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white" />
          </svg>
        </button>
      </div>
    </form>
  </div>
);

export default TypingArea;
