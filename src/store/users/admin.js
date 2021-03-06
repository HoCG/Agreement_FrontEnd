import {requestLogin} from "../../apis/user_api";
import {deleteTokenInLocalStorage, setTokenInLocalStorage} from "../../utils/oauth";
import {deleteAccessTokenInHeader} from "../../apis/common_api";
import {router} from "../../routes/route";

const state = {
    //이 아래 두 데이터는 특정 경우가 아니면 건들지 못하도록 제한을 걸어야함.
    currentUser: initUser(), //현재 유저정보. 로그인되어 사용될 데이터
    LoginMode: false, //로그인 상태 유무를 확인하는 데이터
    accessToken: localStorage.getItem('access_token'),
    AllUsersInfo: [], //저장된 유저들을 담는 배열.

    //이로인해 변수명을 전체적으로 수정할 필요가 있어졌다...!
};

function resetToken(state) {
    deleteTokenInLocalStorage();
    deleteAccessTokenInHeader();
    state.accessToken = null;
}

const getters = {
    isAuthenticated(state) {
        return !!state.accessToken;
    },
};

//사용되는 동작들
const mutations = {
    LOGIN(state) {
        state.accessToken = localStorage.getItem('access_token');
        state.LoginMode = true;
    },
    LOGOUT(state) {
        resetToken(state);
        this
            .$router
            .push({path: '/'})
            .catch(() => {});
    },
    LOGOUT_WITH_TOKEN_INVALIDE(state) {
        resetToken(state);
        if (this
            .$router.currentRoute.name !== 'boards') {
            this
                .$router
                .push({path: '/'})
                .catch(() => {});
        }
    }
};

//비동기 처리들.
const actions = {
    async REQUEST_LOGIN(context, user) {
        try {
            const response = await requestLogin(user);
            setTokenInLocalStorage(response.data);
            context.commit('LOGIN');
            router.push('/UserPage');
            return response;
        } catch (e) {
           alert("로그인 실패");
        }
    },
};

// 백엔드의 관점에서 볼때 time과 date를 나눠서 저장하게 되면 변수도 많아질 뿐더러 굉장히 비효율적일 수 밖에 없다. 저장하는 변수의
// 양을 줄일 수 있다면 줄이는게 맞는것이므로 이렇게 합쳐서 저장한다.
/*
const makeUser = (TheUser_usedByData) => {
    return {
        id: TheUser_usedByData.id,
        password: TheUser_usedByData.password,
        profileImage: TheUser_usedByData.profileImage
    }
};
*/

//이벤트의 형태를 잡아주는 변수.
function initUser() {
    return {
        id: '',
        password: ''
    }
}

export default {mutations, state, actions, getters};