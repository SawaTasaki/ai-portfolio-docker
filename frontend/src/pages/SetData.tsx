import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PlateConfigProps, AiToolProps } from "./props";
import Button from "../components/Button";
import Message from "../components/Message";
import InputField from "../components/InputField";

const SetData: React.FC = () => {
  const [availableCards, setAvailableCards] = useState<AiToolProps[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [plateConfig, setPlateConfig] = useState<PlateConfigProps>({
    rows: 2,
    cols: 3,
  });
  const [plateCards, setPlateCards] = useState<Array<AiToolProps | null>>(
    Array(plateConfig.rows * plateConfig.cols).fill(null)
  );
  const [message, setMessage] = useState<string>("");
  const [newCard, setNewCard] = useState<{
    tool_name: string;
    company: string;
  }>({
    tool_name: "",
    company: "",
  });
  const navigate = useNavigate();

  // 初回データ取得
  useEffect(() => {
    async function fetchAiTools() {
      console.log("バックエンドURL:", import.meta.env.VITE_BACKEND_URL);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${backendUrl}/getdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("ファイルが見つかりませんでした…。");
        }
        const data: AiToolProps[] = await response.json();
        setAvailableCards(data || []);
      } catch (error) {
        console.error("データの取得に失敗してしまいました…。", error);
      }
    }
    fetchAiTools();

    const savedState = localStorage.getItem("appState");
    if (savedState) {
      handleRestoreLocalStorage();
    }
  }, []);

  // メッセージ表示
  const showMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(""); // 2秒後にメッセージを非表示に
    }, 2000);
  };

  // プレート設定の変更
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = Math.max(1, Math.min(5, parseInt(value) || 1));

    const newConfig = { ...plateConfig, [name]: newValue };
    setPlateConfig(newConfig);
    setPlateCards(Array(newConfig.rows * newConfig.cols).fill(null));
  };

  // ユーザー名の変更
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  // アバター画像のアップロード
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    // if (file) {
    //   setAvatar(URL.createObjectURL(file));
    // }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatar(reader.result); // Base64エンコードされた文字列として設定
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ドラッグ開始時の処理
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    card: AiToolProps,
    index: number,
    fromPlate = false
  ) => {
    e.dataTransfer.setData("card", JSON.stringify(card));
    e.dataTransfer.setData("fromIndex", index.toString());
    e.dataTransfer.setData("fromPlate", fromPlate.toString());
  };

  // ドラッグ可能エリアの設定
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // ドロップ時の処理
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData("card"));
    const fromIndex = parseInt(e.dataTransfer.getData("fromIndex"));
    const fromPlate = e.dataTransfer.getData("fromPlate") === "true";

    // 新しいプレートカード配列
    const newPlateCards = [...plateCards];

    // プレートからドラッグした場合はカードを入れ替え
    const previousCard = newPlateCards[toIndex];
    if (fromPlate) {
      newPlateCards[fromIndex] = previousCard;
    }

    // ドロップ先に設定
    newPlateCards[toIndex] = card;

    setPlateCards(newPlateCards);
  };

  // テーブルからカードを１枚削除
  const handleRemoveCard = (index: number) => {
    const newPlateCards = [...plateCards];
    newPlateCards[index] = null;
    setPlateCards(newPlateCards);
  };

  // テーブルからカードを全て削除（ローカルストレージは残る）
  const handleRemoveAllCards = () => {
    setPlateCards(Array(plateConfig.rows * plateConfig.cols).fill(null));
    showMessage(
      "すべてのカードが消去されました！（ローカルストレージは残っています。）"
    );
  };

  // ローカルストレージを削除
  const handleRemoveLocalStorage = () => {
    setPlateCards(Array(plateConfig.rows * plateConfig.cols).fill(null));
    localStorage.removeItem("appState");
    showMessage("ローカルストレージを削除しました！");
  };

  // ローカルストレージに保存
  const handleSaveLocalStorage = () => {
    const state = {
      plateConfig,
      plateCards,
      avatar,
      userName,
    };
    localStorage.setItem("appState", JSON.stringify(state));
    showMessage("ローカルストレージに保存しました！");
  };

  // ローカルストレージから復元
  const handleRestoreLocalStorage = () => {
    const savedData = localStorage.getItem("appState");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserName(parsedData.userName || "");
      setAvatar(parsedData.avatar || null);
      setPlateConfig(parsedData.plateConfig || { rows: 2, cols: 3 });
      setPlateCards(
        parsedData.plateCards ||
          Array(plateConfig.rows * plateConfig.cols).fill(null)
      );
      showMessage("ローカルストレージから復元しました！");
    } else {
      showMessage("ローカルストレージは空です…。");
    }
  };

  // 新しいタブで開く
  const openInNewTab = () => {
    const isSet = localStorage.getItem("appState");
    if (isSet) {
      window.open("/new-tab", "_blank");
    } else {
      showMessage(
        "プレビューを見るには「ローカルストレージに保存」ボタンを押してください。"
      );
    }
  };

  // ホームに戻る
  const goHome = () => {
    navigate("/");
  };

  // 新しいカードをデータベースに追加する
  const handleAddCardToDB = (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信によるページリロードを防ぐ

    if (newCard.tool_name && newCard.company) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      fetch(`${backendUrl}/adddata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool_name: newCard.tool_name,
          company: newCard.company,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ai_tool_id) {
            setAvailableCards([...availableCards, data]); // リロードしなくても追加したカードを表示できるようにする
            setNewCard({ tool_name: "", company: "" });
            showMessage("カードがDBに追加されました！");
            console.log("カードがDBに追加されました：", [...availableCards, data]);
          } else {
            console.error("カード追加に失敗しました。");
            showMessage("カードの追加に失敗しました。もう一度試してください。");
          }
        })
        .catch((error) => {
          console.error("エラーが発生しました：", error);
        });
    } else {
      showMessage("ツール名と提供企業名を両方入力してください");
    }
  };
  
  // 新しいカードをローカルに追加する
  const handleAddCardtoLocal = (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信によるページリロードを防ぐ

    if (newCard.tool_name && newCard.company) {
      const newCardData: AiToolProps = {
        ai_tool_id: (availableCards.length)*-1,
        tool_name: newCard.tool_name,
        company: newCard.company,
      };
      setAvailableCards([...availableCards, newCardData]);
      setNewCard({ tool_name: "", company: "" });
      showMessage("カードがローカルに追加されました！（画面をリロードすると消えます）");
      console.log("カードがローカルに追加されました：", [...availableCards, newCardData]);
    } else {
      showMessage("ツール名と提供企業名を両方入力してください");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-7xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          マイ AI スタック 📸
        </h1>

        {/* メッセージ表示 */}
        {message && <Message message={message} />}

        {/* ユーザー情報表示 */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold">
            {avatar ? (
              <img
                src={avatar}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              "?"
            )}
          </div>
          <div className="text-xl font-semibold">{userName || "ゲスト"}</div>
        </div>

        {/* ユーザープロファイル設定 */}
        <div className="mb-6 p-4 border bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">プロファイル設定</h2>
          <div className="flex space-x-4">
            <InputField
              label="名前："
              type="text"
              value={userName}
              onChange={handleNameChange}
              placeholder="あなたの名前"
            />
            <InputField
              label="アイコン："
              type="file"
              onChange={handleImageSelect}
              accept="image/*"
            />
          </div>
        </div>

        {/* プレート設定 */}
        <div className="mb-6 p-4 border bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">プレート設定</h2>
          <div className="flex space-x-4">
            <InputField
              label="行数（１～５）："
              type="number"
              name="rows"
              value={plateConfig.rows}
              onChange={handleConfigChange}
              min={1}
              max={5}
            />
            <InputField
              label="列数（１～５）："
              type="number"
              name="cols"
              value={plateConfig.cols}
              onChange={handleConfigChange}
              min={1}
              max={5}
            />
          </div>
        </div>

        {/* 新しいカードを追加するフォーム */}
        <div className="mb-6 p-4 border bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">カードを追加</h2>
          <form className="flex space-x-4">
            <InputField
              label="ツール名："
              type="text"
              value={newCard.tool_name}
              onChange={(e) =>
                setNewCard({ ...newCard, tool_name: e.target.value })
              }
              placeholder="ChatGPT-4.0"
            />
            <InputField
              label="提供企業名："
              type="text"
              value={newCard.company}
              onChange={(e) =>
                setNewCard({ ...newCard, company: e.target.value })
              }
              placeholder="OpenAI"
            />
            {/* 新しいカードをデータベースに追加するボタン */}
            <Button
              onClick={handleAddCardToDB}
              label="DBに追加する"
              bgColor="bg-blue-500"
              hoverColor="bg-blue-600"
            />
            {/* 新しいカードをローカルに追加するボタン */}
            <Button
              onClick={handleAddCardtoLocal}
              label="ローカルに追加する"
              bgColor="bg-blue-500"
              hoverColor="bg-blue-600"
            />
          </form>
        </div>

        {/* 利用可能なカード */}
        <div className="mb-6 p-4 border bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">利用可能なカード</h2>
          <div className="flex flex-wrap gap-2">
            {availableCards.map((card, index) => (
              <div
                key={card.ai_tool_id}
                draggable
                onDragStart={(e) => handleDragStart(e, card, index)}
                className="w-auto h-full bg-white border-2 border-blue-500 rounded flex items-center justify-center text-2xl font-bold cursor-move shadow-md hover:shadow-lg p-4"
              >
                {card.tool_name}({card.company})
              </div>
            ))}
          </div>
        </div>

        {/* プレート */}
        <div className="mb-6 p-4 border bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">あなたのプレート</h2>
          <div
            className="grid flex flex-wrap gap-2"
            style={{
              gridTemplateColumns: `repeat(${plateConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${plateConfig.rows}, 1fr)`,
            }}
          >
            {plateCards.map((card, index) => (
              <div
                key={`plate-${index}`}
                className="w-full h-full bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {card ? (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, card, index, true)}
                    className="w-full h-full bg-white border-2 border-blue-500 rounded flex items-center justify-center text-2xl font-bold cursor-move shadow-md hover:shadow-lg p-4 relative"
                  >
                    {card.tool_name}({card.company})
                    <div
                      className="absolute top-0 right-0 text-xl bg-red-500 text-white px-1 rounded"
                      onClick={() => handleRemoveCard(index)}
                    >
                      ×
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-300">ここにドロップ</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* すべてのカードをuseStateから消すボタン */}
        <Button
          onClick={handleRemoveAllCards}
          label="すべてのカードを消す"
          bgColor="bg-orange-500"
          hoverColor="bg-orange-600"
        />

        {/* すべてのカードをローカルストレージから消すボタン */}
        <Button
          onClick={handleRemoveLocalStorage}
          label="ローカルストレージを消す"
          bgColor="bg-red-500"
          hoverColor="bg-red-600"
        />

        {/* ローカルストレージに保存するボタン */}
        <Button
          onClick={handleSaveLocalStorage}
          label="ローカルストレージに保存"
          bgColor="bg-blue-500"
          hoverColor="bg-blue-600"
        />

        {/* ローカルストレージからデータを復元するボタン */}
        <Button
          onClick={handleRestoreLocalStorage}
          label="ローカルストレージから復元"
          bgColor="bg-purple-500"
          hoverColor="bg-purple-600"
        />

        {/* 新しいタブで開くボタン */}
        <Button
          onClick={openInNewTab}
          label="新しいタブで開く"
          bgColor="bg-green-500"
          hoverColor="bg-green-600"
        />

        {/* ホームに戻るボタン */}
        <Button
          onClick={goHome}
          label="ホームに戻る"
          bgColor="bg-yellow-500"
          hoverColor="bg-yellow-600"
        />
      </div>
    </div>
  );
};

export default SetData;
