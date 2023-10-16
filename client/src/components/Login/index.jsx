// @ts-check
import {Toast} from "react-bootstrap";
import React, {useState} from "react";
import "./style.css";
import "fa-icons";

export default function Login({onLogIn}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const onSubmit = async (event) => {
        event.preventDefault();
        onLogIn(username, password, setError);
    };

    return (
        <>
            <div className="login-form text-center login-page h-100">
                <div
                    className="w-75 mt-5"
                    style={{
                        boxShadow: "0 0.75rem 1.5rem rgba(18,38,63,.1)",
                        maxWidth: "400px"
                    }}
                >
                    <div className="row">
                        <div
                            className="col no-gutters align-items-center mx-auto"
                            style={{
                                maxWidth: 400,
                                backgroundSize: "cover",
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                            }}
                        >
                            <div className="col text-secondary text-center mt-2">
                                <h4 className="font-size-15">Welcome to fast chat !</h4>
                                <p>Find friends and talk!</p>
                            </div>
                            <div className="col align-self-end p-3">
                                <img
                                    alt="welcome back"
                                    style={{maxWidth: "100%"}}
                                    src={`${process.env.PUBLIC_URL}/welcome-back.png`}
                                />
                            </div>
                        </div>
                        <div className={'p-3 text-primary font-size-12'}>
                            <p>Login or register with minimal steps. If you don't have account, we will create one for
                                you!</p>
                        </div>
                        <div
                            className="position-absolute"
                            style={{bottom: -36, left: 20}}
                        >
                        </div>
                    </div>

                    <form
                        className="bg-white text-left px-4"
                        style={{
                            paddingTop: 58,
                            borderBottomLeftRadius: 4,
                            borderBottomRightRadius: 4,
                        }}
                        onSubmit={onSubmit}
                    >

                        <label className="font-size-12">Name</label>

                        <div className="username-select mb-3">
                            <input
                                value={username}
                                id={"input-username"}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={"Username"}
                                className="form-control"
                                required
                            />
                        </div>

                        <label htmlFor="inputPassword" className="font-size-12">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            id="inputPassword"
                            className="form-control"
                            placeholder="*********"
                            required
                        />
                        <div style={{height: 30}}/>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">
                            Sign in
                        </button>
                        <div className="login-error-anchor">
                            <div className="toast-box">
                                <Toast
                                    style={{minWidth: 277}}
                                    onClose={() => setError(null)}
                                    show={error !== null}
                                    delay={3000}
                                    autohide
                                >
                                    <Toast.Header>
                                        <img
                                            src="holder.js/20x20?text=%20"
                                            className="rounded mr-2"
                                            alt=""
                                        />
                                        <strong className="mr-auto">Error</strong>
                                    </Toast.Header>
                                    <Toast.Body>{error}</Toast.Body>
                                </Toast>
                            </div>
                        </div>
                        <div style={{height: 30}}/>
                    </form>
                </div>
            </div>
        </>
    );
}
