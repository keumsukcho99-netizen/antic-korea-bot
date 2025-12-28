import streamlit as st
import google.generativeai as genai

# 웹사이트 제목 설정
st.title("Antic Korea AI 챗봇 🏺")
st.write("한국의 전통 문화와 역사에 대해 물어보세요. (made by 조금숙)")

# API 키 설정 (나중에 스트림릿 설정에서 입력할 것입니다)
if "GOOGLE_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
else:
    st.error("API 키가 아직 설정되지 않았습니다.")

# 채팅 기록 초기화
if "messages" not in st.session_state:
    st.session_state.messages = []

# 이전 대화 내용 화면에 출력
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 사용자 입력 받기
if prompt := st.chat_input("질문을 입력하세요..."):
    # 사용자 메시지 표시
    st.chat_message("user").markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    try:
        # AI 모델 불러오기 (Gemini Pro)
        model = genai.GenerativeModel('gemini-1.5-flash')        

        response = model.generate_content(prompt)
        # AI 응답 표시
        with st.chat_message("assistant"):
            st.markdown(response.text)
        st.session_state.messages.append({"role": "assistant", "content": response.text})
    except Exception as e:
        st.error(f"오류가 발생했습니다: {e}")
