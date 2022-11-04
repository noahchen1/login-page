import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const RESITER_URL = 'http://localhost:4000/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        const match = pwd === matchPwd;
        setValidPwd(result);
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd, matchPwd]);

    const handleSubmit = e => {
        e.preventDefault();
        const newUser = {
            username: user,
            password: pwd
        };
        axios.post(RESITER_URL, newUser
        //     {
        //     headers: {'Content-Type': 'application/json'},
        //     withCredentials: true
        // }
        ).then(res => {
            setSuccess(true);
        }).catch(err => {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken')
            } else {
                setErrMsg('Registration Failed.')
            }
            errRef.current.focus();
        }) 

    }
    return (
        <>
            {success ? (
                <section>
                    <h1>success</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (

                <section>
                    <p ref={errRef} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='username'>
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={e => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote" //requirment to announce by screen reader
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote">
                            4 to 24 characters. <br />
                            Must begin with a letter. <br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label htmlFor='password'>
                            Password:
                        </label>

                        <input
                            type="password"
                            id="password"
                            onChange={e => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : true}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />

                        <p id="pwdnote">
                            8 to 24 characters. <br />
                            Must include uppercase and lowercase letters, a number and a special character. <br />
                            Allowed special cahracters:
                            <span aria-label="exclamation mark">!</span>
                            <span aria-label="at symbol">@</span>
                            <span aria-label="hashtag">#</span>
                            <span aria-label="dollar sign">$</span>
                            <span aria-label="percent">%</span>
                        </p>

                        <label htmlFor='confirm-pwd'>
                            Confirm Password:
                        </label>

                        <input
                            type="password"
                            id="confirm-pwd"
                            onChange={e => setMatchPwd(e.target.value)}
                            required
                            aria-invalid={validMatch ? "false" : true}
                            aria-describedby="confirmpwdnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />

                        <p id="confirmpwdnote">
                            Must match the first password input field
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign up</button>
                    </form>
                </section>
            )};
        </>
    )
};

export default Register;