import store from '../../store/store';

export default {
    myFunction(getData) {
        let drawerDiv = document.getElementById("drawer");
        let computed_Object_Style = window.getComputedStyle(drawerDiv);
        let computed_Ratio = parseInt(computed_Object_Style.width, 10) / store.state.PDFScreenInfo.OriginalWidth[0];
        const NewElementDiv = document.getElementById(getData.htmlID);
        //데이터값에 저장되어있는 width, height, left, top값을 모두 적용시켜줍니다.
        NewElementDiv.style.width = getData.width * computed_Ratio + "px";
        NewElementDiv.style.height = getData.height * computed_Ratio + "px";
        NewElementDiv.style.left = getData.x * computed_Ratio + "px";
        NewElementDiv.style.top = getData.y * computed_Ratio + "px";
        //데이터를 읽는형태인지, 새로 클릭하여 추가된 형태인지를 판단한 다음에 이를 알맞게 추가시켜줍니다.
        //push_or_readCheck >> true면 데이터를 넣는 형태, false면 데이터를 읽는 형태
        this.append_Into_PDFPage_For_ReadingObject(getData);
    },
    append_Into_PDFPage_For_ReadingObject(getData) {
        let drawerDiv = document.getElementById("drawer");
        let computed_Object_Style = window.getComputedStyle(drawerDiv);
        let computed_Ratio = parseInt(computed_Object_Style.width, 10) / store.state.PDFScreenInfo.OriginalWidth[0];
        let getElement = document.getElementById(getData.htmlID);
        getElement.style.display = "flex";
        for (let i = 1; i <= store.state.PDFScreenInfo.PDFPageInfo; i++) {
            const PDF_Pages = document.getElementById("page" + String(i));
            PDF_Pages.style.position = "relative";
            if (getData.page === i) {
                getElement.style.top = getData.y * computed_Ratio  + "px"; //이미 height를 제외하고 적용하는게 된 상태이니 y값을 그대로 넣어주도록 설정.
                getElement.style.left =  getData.x * computed_Ratio + "px";
                PDF_Pages.append(getElement);
                break;
            }
        }
    }
}