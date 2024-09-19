import { useState, useEffect } from "react";

import { AiOutlineArrowRight } from "react-icons/ai";
import Change_user from "./change_user";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function User_card(props) {
    const [name, SetName] = useState(props.user_name);
    const [image_url, SetImage_url] = useState(props.icons);
    const [nameError, SetNameError] = useState("");
    const [state, Setstate] = useState("");
    const [totalScore, setTotalScore] = useState(0); // 特定日付以降の合計スコア
    const targetDate = "2024-09-20"; // 特定の日付（例：2024年9月20日以降）

    const update_handler = () => {
        console.log("update_handler");
        console.log(name);
        console.log(image_url);
        if (nameError == false) {
            props.cont.update_user_data(name, image_url);
        } else {
            Setstate(false);
        }
    };
    
    // 特定の日以降のスコアを計算する関数
    const calculateTotalScoreForSpecificPeriod = (targetDate, answers) => {
        let total = 0;
        const target = new Date(targetDate); // 絞り込み対象の日付
        answers.forEach((answer) => {
            const answerDate = new Date(answer.answer_time * 1000); // UNIXタイムスタンプを通常の時間に変換

            // 特定の日付以降の回答のみを合計
            if (answerDate >= target) {
                total += answer.reward; // 獲得スコアを合計
            }
        });
        return total;
    };
    
    const handle_SetName = (event) => {
        const value = event.target.value;
        SetName(value);

        // 電話番号の正規表現パターン
        const phonePattern = /^\d{2}[a-zA-Z]\d{4}$/;

        // 入力値が正規表現にマッチしない場合は、エラーメッセージを設定
        if (!phonePattern.test(value)) {
            SetNameError(true);
            console.log("errr");
        } else {
            SetNameError(false);
        }
    };

    // クイズデータを取得してスコアを計算する関数
    const fetchAndCalculateScore = async () => {
        try {
            // スマートコントラクトから全ての回答データを一括取得
            const answers = await props.cont.methods.get_all_answers().call(); 
            const total = calculateTotalScoreForSpecificPeriod(targetDate, answers); // 日付で絞り込んで合計
            setTotalScore(total); // 合計スコアを状態に保存
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        }
    };

    //初回のみ実行
    useEffect(() => {
        console.log("初回のみ実行");
        console.log(props.state);
        console.log(props.user_name);
        console.log(props.icons);
        Setstate(props.state);
        fetchAndCalculateScore();
    }, []);
    return (
        <>
            <div className="user_card">
                <Button variant="primary" onClick={() => props.cont.add_token_wallet()} style={{ position: "absolute", top: 0, left: 0 }}>
                    トークンをwalletに追加
                </Button>
                <div className="address" style={{ "margin-top": "50px" }}>
                    {props.address.slice(0, 20)}....
                </div>

                {/* マージンを設定 */}
                <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col token d-flex flex-column">
                        <div>保有トークン</div>
                        <div>{props.token}FLT</div>
                    </div>
                    <div className="col token-result d-flex flex-column">
                        <div>現在の順位</div>
                        <div>{props.num_of_student}人中{props.rank}位</div>
                    </div>
                    <div className="col token-result d-flex flex-column">
                        <div>2024年9月20日以降の獲得点数</div>
                        <div>{totalScore/20}点</div> {/* 特定日付以降の合計点数を表示 */}
                    </div>
                </div>
            </div>
        </>
    );
}
export default User_card;