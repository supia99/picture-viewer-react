# ローカル証明書(CA)の発行と Ubuntu / Windows / Android への登録方法

Ubuntu 上で mkcert を使ってローカル開発用の証明書を発行し、その CA(認証局)証明書を Ubuntu / Windows / Android の各端末に登録して、自己署名証明書を「保護された接続」として扱えるようにする手順をまとめます。

## 0. 全体の考え方

mkcert は次の2種類の証明書を扱います。

| 種類 | ファイル | 役割 |
|---|---|---|
| ルートCA証明書 | `rootCA.pem` | 「このCAが署名した証明書は信頼してよい」という信頼の起点。**各端末に1回登録する** |
| サーバー証明書 | `localhost+2.pem` など | 実際に nginx / Vite に読み込ませる、ホスト名・IP ごとの証明書 |

各端末に登録するのは **ルートCA証明書 (`rootCA.pem`) だけ** です。これを一度登録しておけば、以降 mkcert で何度サーバー証明書を発行し直しても、端末側で再登録する必要はありません。

サーバー証明書 (`localhost+2.pem`) を CA として端末に登録しても機能しません。CA ではなく、単一サイト用の証明書だからです。

---

## 1. Ubuntu で証明書を生成する

### 1.1. mkcert のインストール

```bash
sudo apt update
sudo apt install -y curl ca-certificates libnss3-tools
```

`libnss3-tools` を入れておくと、`certutil` が使えるようになり、Chrome / Chromium の信頼ストア (NSS) への登録が自動化されます。

GitHub のリリースから mkcert 本体を取得します。

```bash
mkdir -p /tmp/mkcert-install
curl -fsSL -L https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 -o /tmp/mkcert-install/mkcert
chmod +x /tmp/mkcert-install/mkcert
sudo install -m 0755 /tmp/mkcert-install/mkcert /usr/local/bin/mkcert
```

> 新しいバージョンが出ている場合は `v1.4.4` の部分を最新版に置き換えてください。

インストール確認:

```bash
mkcert -h
```

### 1.2. ローカル CA を作成し、Ubuntu 自身に信頼登録する

**必ず sudo を付けずに**、一般ユーザー権限で実行します。

```bash
mkcert -install
```

`sudo mkcert -install` を実行すると、root ユーザー専用の別 CA が作られてしまい、一般ユーザーで動くブラウザから信頼されません。

これにより、次の場所に CA が作成されます。

```bash
mkcert -CAROOT
# 例: /home/<user>/.local/share/mkcert
```

```text
rootCA.pem      # CA の公開証明書 (これを他端末に配る)
rootCA-key.pem  # CA の秘密鍵 (絶対に配布しない)
```

同時に、Chrome / Chromium が参照する NSS 共有DB (`~/.pki/nssdb`) にも登録されます。

```bash
certutil -d sql:$HOME/.pki/nssdb -L | grep mkcert
# 例: mkcert development CA ...   C,,
```

`C,,` は「SSL用のCAとして信頼する」という trust flag です。

### 1.3. サーバー証明書を発行する

公開したいホスト名・IP をすべて列挙して発行します。

```bash
mkcert localhost 127.0.0.1 192.168.0.10
```

```text
localhost+2.pem       # サーバー証明書
localhost+2-key.pem   # サーバーの秘密鍵
```

このファイルは nginx や Vite に読み込ませて使います(このドキュメントの対象外)。

---

## 2. Ubuntu の別端末・別ユーザーに CA を登録する

同じ CA を使う場合、Ubuntu の別ユーザーや別マシンでも `rootCA.pem` を配って登録できます。

### 2.1. 証明書を転送する

```bash
cp "$(mkcert -CAROOT)/rootCA.pem" ~/rootCA.pem
```

USB やクラウド共有などで転送先の端末に送ります。

### 2.2. 転送先で NSS DB に登録する

転送先にも `libnss3-tools` を入れます。

```bash
sudo apt install -y libnss3-tools
```

自分のユーザーの NSS DB (Chrome / Chromium が使用) に登録します。

```bash
mkdir -p "$HOME/.pki/nssdb"
certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "mkcert (imported)" -i ~/rootCA.pem
```

登録確認:

```bash
certutil -d sql:$HOME/.pki/nssdb -L | grep mkcert
```

Firefox は独自のプロファイルを使うため、`about:preferences#privacy` → 証明書を表示 → 認証局 → インポート、から同じ `rootCA.pem` を追加してください。

---

## 3. Windows に CA を登録する

### 3.1. 証明書を転送する

Ubuntu で作成した `rootCA.pem` を Windows 端末にコピーします(USB、クラウド共有、`scp` など)。

### 3.2. 証明書ストアにインポートする

GUI での手順:

1. `rootCA.pem` を右クリック → **証明書のインストール**
2. 保存場所は **現在のユーザー**(自分のブラウザだけで使う場合)、または **ローカルコンピューター**(端末全体・管理者権限が必要)
3. **証明書をすべて次のストアに配置する** を選び、**信頼されたルート証明機関** を選択
4. 完了 → 警告が出るので「はい」で承認

PowerShell での手順(管理者権限):

```powershell
Import-Certificate -FilePath "C:\path\to\rootCA.pem" -CertStoreLocation Cert:\LocalMachine\Root
```

現在のユーザーだけに登録する場合:

```powershell
Import-Certificate -FilePath "C:\path\to\rootCA.pem" -CertStoreLocation Cert:\CurrentUser\Root
```

### 3.3. 確認

`certmgr.msc` を開き、「信頼されたルート証明機関」→「証明書」に `mkcert development CA ...` という名前の証明書があれば登録完了です。

> Chrome / Edge は Windows の証明書ストアをそのまま参照するため、上記のインポートだけで両方のブラウザに反映されます。Firefox は独自ストアなので、Firefox の設定からも別途インポートが必要です。

---

## 4. Android に CA を登録する

### 4.1. 証明書を転送する

`rootCA.pem` を Android 端末に転送します(USB、メール、クラウド共有など)。

### 4.2. 証明書をインストールする

1. [設定] → [セキュリティとプライバシー] → [暗号化と認証情報]
2. [証明書をインストール] または [CA 証明書をインストール] をタップ
3. 転送した `rootCA.pem` を選択

### 4.3. 種類は「CA証明書」を選ぶ

選択肢が出る場合は、必ず次を選びます。

- **CA証明書**(信頼できる認証局)

「VPNとアプリ用」ではなく「CA証明書」を選ぶのがポイントです。「ユーザー証明書」を選んでしまうと、クライアント認証用として扱われ、ブラウザのサーバー証明書検証には使われません。

### 4.4. 確認

Android Chrome から、証明書に含めたホスト名・IPでアクセスします。

```text
https://192.168.0.10:4173
```

鍵アイコンが表示され、警告が出なければ登録成功です。

> Android 7 (Nougat) 以降、多くのアプリはユーザーが追加したCAをデフォルトで信頼しません(WebView や一部アプリ)。ただし通常の Chrome ブラウザでの閲覧には影響しません。

---

## 5. まとめ

1. Ubuntu で `mkcert -install`(sudoなし)してローカルCAを作成
2. `mkcert <ホスト名/IP...>` でサーバー証明書を発行
3. `rootCA.pem` だけを各端末(Ubuntu/Windows/Android)に配布
4. 各端末で「CA証明書」として1回だけ登録
5. 以降はサーバー証明書を何度発行し直しても、端末側の再登録は不要
