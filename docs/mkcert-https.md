# mkcert を使ったローカル HTTPS 証明書の発行と端末登録方法

このドキュメントでは、ローカル開発環境で HTTPS を有効にするために、mkcert を使って証明書を発行し、Ubuntu と Android 端末に登録する手順をまとめます。

## 1. 概要

Chrome などのブラウザでは、PWA や HTTPS が必要な機能を扱う際に証明書が必要です。ローカル開発では本番用の正式な証明書ではなく、自己署名証明書を使う方法がよく使われます。

mkcert はローカル開発用の証明書を簡単に作成できるツールです。

---

## 2. mkcert のインストール

Ubuntu では次の手順でインストールできます。

### 2.1. 依存関係の確認

```bash
sudo apt update
sudo apt install -y curl ca-certificates
```

### 2.2. mkcert のインストール

GitHub のリリースにはバージョン付きのファイル名があり、`latest/download/mkcert-linux-amd64` という URL は正しくありません。実際の asset 名は `mkcert-v1.4.4-linux-amd64` のような形式です。

```bash
mkdir -p /tmp/mkcert-install
curl -fsSL -L https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 -o /tmp/mkcert-install/mkcert
chmod +x /tmp/mkcert-install/mkcert
sudo install -m 0755 /tmp/mkcert-install/mkcert /usr/local/bin/mkcert
```

> もし新しいバージョンが出ていれば、URL の `v1.4.4` と `mkcert-v1.4.4-linux-amd64` の部分を最新のバージョン名に置き換えてください。

### 2.3. インストール確認

```bash
mkcert -h
```

---

## 3. ローカル証明書の発行

ローカルの開発用ドメインを使う場合は、例えば `localhost` と `127.0.0.1` を証明書に含めます。

```bash
mkcert localhost 127.0.0.1
```

また、同じ LAN 上の Android 端末からアクセスする場合は、端末の IP アドレスやホスト名も含めると便利です。

```bash
mkcert localhost 127.0.0.1 192.168.0.10
```

この例では以下のファイルが生成されます。

```text
localhost+2.pem
localhost+2-key.pem
```

生成先は実行したカレントディレクトリです。

> 例: `~/project` で実行した場合、`localhost+2.pem` と `localhost+2-key.pem` がそのディレクトリに作成されます。

---

## 4. Vite で HTTPS を使う

開発サーバーやプレビューサーバーを HTTPS で起動するには、証明書のファイルを指定します。

### 4.1. 開発サーバー

```bash
npm run dev -- --host 0.0.0.0 --https --cert localhost+2.pem --key localhost+2-key.pem
```

### 4.2. プレビューサーバー

```bash
npm run preview -- --host 0.0.0.0 --port 4173 --https --cert localhost+2.pem --key localhost+2-key.pem
```

ブラウザでアクセスする場合は以下のような URL を使います。

```text
https://localhost:4173
```

もし Android 端末から同一 LAN 内の PC へアクセスする場合は、PC の IP を使う形が必要になることがあります。

```text
https://192.168.0.10:4173
```

---

## 5. Ubuntu での証明書登録方法

Ubuntu では、ローカルの CA をシステムに信頼させて、ブラウザが自己署名証明書を安全に扱えるようにする必要があります。

### 5.1. mkcert でローカル CA を作成

Linux で Chrome / Chromium を使う場合、`mkcert -install` だけでは不十分なことがあります。`libnss3-tools` が入っていないと、ブラウザが信頼済み CA として認識しない場合があります。

```bash
sudo apt install -y libnss3-tools
mkcert -install
```

これで、ローカル証明書を発行した際に使う CA が Ubuntu のシステムとブラウザの信頼ストアに登録されます。

> もし `mkcert -install` の実行時に `certutil` が不足していると警告が出る場合は、上の `libnss3-tools` を入れてから再実行してください。

### 5.2. 生成した証明書をブラウザで使う

`mkcert localhost 127.0.0.1` で作成した証明書は `localhost+2.pem` です。

Ubuntu の Chrome / Chromium の場合、ローカル CA を信頼済みにしていれば、その証明書は安全に扱われます。

### 5.3. もし証明書が不正扱いされる場合

次を確認してください。

- `mkcert -install` を実行済みか
- 証明書が `localhost` に対して発行されているか
- ブラウザがローカル CA を信頼しているか

---

## 6. Android での証明書登録方法

Android は一般的に、ローカル開発用の自己署名証明書をそのまま信頼するには追加の手順が必要です。

### 6.1. 証明書ファイルを端末へ転送

PC 上で生成した証明書ファイルを Android に転送します。

例:

```text
localhost+2.pem
```

USB で転送するか、メールやクラウド共有で端末に送ります。

### 6.2. Android で証明書を開く

Android の設定で次をたどります。

- [設定] → [セキュリティとプライバシー] → [暗号化と認証情報]
- [証明書をインストール] または [CA 証明書をインストール]

その後、転送した証明書ファイルを選択します。

### 6.3. 「ユーザー証明書」または「信頼できる認証局」を選択

証明書の種類によって表示が変わりますが、通常は次のどちらかを選択します。

- 信頼できる認証局
- ユーザー証明書

### 6.4. 証明書をインストール

端末側の指示に従ってインストールします。

### 6.5. Android Chrome からアクセス

次のような URL でアクセスできるようになります。

```text
https://192.168.0.10:4173
```

または、PC の開発環境で `localhost` に対して割り当てているホスト名を使う方法もあります。

---

## 7. Android の注意点

Android では、次の条件に注意が必要です。

- 自己署名証明書は通常「信頼済み CA として登録」しないとブラウザが拒否する
- 端末と PC が同一 LAN にあること
- Android のブラウザがアクセス先を信頼していること

一部の Android 端末では、OS のバージョンやブラウザのポリシーによって証明書の扱いが厳しくなります。

---

## 8. 典型的な接続例

PC 側で HTTPS サーバーを起動

```bash
npm run preview -- --host 0.0.0.0 --port 4173 --https --cert localhost+2.pem --key localhost+2-key.pem
```

Ubuntu からのアクセス

```text
https://localhost:4173
```

Android からのアクセス

```text
https://192.168.0.10:4173
```

---

## 9. まとめ

ローカル HTTPS を使うための基本は次の通りです。

1. `mkcert` をインストールする
2. 証明書を発行する
3. Vite で HTTPS を有効にする
4. Ubuntu では `mkcert -install` で CA を信頼する
5. Android では証明書をインストールして信頼する

これで、Chrome や Android ブラウザでローカルアプリのような動作確認がしやすくなります。

---

## 10. 参考コマンド一覧

```bash
# インストール
mkcert -install

# 証明書発行
mkcert localhost 127.0.0.1 192.168.0.10

# Vite 開発サーバー
npm run dev -- --host 0.0.0.0 --https --cert localhost+2.pem --key localhost+2-key.pem

# Vite プレビュー
npm run preview -- --host 0.0.0.0 --port 4173 --https --cert localhost+2.pem --key localhost+2-key.pem
```

必要であれば次に、`package.json` に HTTPS 用の npm script を追加する例まで作成できます。
