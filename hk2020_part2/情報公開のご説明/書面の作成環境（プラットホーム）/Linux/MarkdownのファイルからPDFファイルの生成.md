# MarkdownのファイルからPDFファイルの生成

## pandocコマンドを使ったMarkdownファイルからPDFファイルの生成，目次付き

　pandocコマンドは，これまでorg-modeやMarkdownファイルからWordのdocxファイルの変換に使うことがあったのですが，PDFファイルに返還する場合は，Latexの開発環境が必要になるようです。さらにコマンドの実行時にオプションの指定をする必要がありました。

　Latexは平成21年3月より前，羽咋市に住んでいた頃によく使っていましたが，けっこう痛い目にあった経験もあります。Latexの開発環境も次第に構築が簡単になっていきましたが，ここ数年は全く使うこともなくUbuntuにインストールはしていませんでした。

　Latexの日本語環境のインストールは10年ほど前もいろいろありましたが，まとまったパッケージをインストールすると１G以上のディスク容量を使うという話でした。WordのようなワープロソフトでもPDFファイルの作成は出来るのでLatexの環境は必要ないという考えでもありました。

```
日本語(マルチバイト文字)を含むMarkdown形式のファイルをPDFにするのに苦労したので、そのやり方です。
OSはUbuntu 14.04 LTSです。

まず、必要なパッケージをインストールします。texlive-lang-cjkのサイズが特に大きいのでご注意下さい。
sudo apt-get install pandoc luatex texlive-xetex texlive-fonts-recommended texlive-lang-cjk 
以下のコマンドで 、UTF-8で保存したMarkdown形式のファイルfoo.mdをfoo.pdfに変換できます。
 pandoc foo.md -o foo.pdf -V documentclass=ltjarticle --latex-engine=lualatex
私は試していませんが、http：//oku.edu.mie-u.ac.jp/~okumura/texwiki/?Pandoc
によれば、頑張ればltjarticleの代わりにltjsarticleを指定することも出来るようです。

［source：］自己解体 UbuntuでPandocを使って日本語を含むMarkdownをPDFに変換する。 http://ninegw.blog133.fc2.com/blog-entry-36.html
```

　上記のページを参考にしたのですが，Latexの環境のインストールは，このページを見つける前に終わっていたように思います。助かったのは「 -V documentclass=ltjarticle --latex-engine=lualatex」というオプションの指定方法です。

　検索では，単に「 --pdf-engine=lualatex」とするオプションの指定方法ばかりだったのですが，これだと日本語の問題でエラーが起きていました。

```
pandoc -o sample.pdf \
	       -N \
         -V documentclass=ltjarticle --latex-engine=lualatex \
	       -f markdown+ignore_line_breaks+footnotes+definition_lists \
	       -V titlepage=true \
	       -V toc-own-page=true \
	       --table-of-contents \
	       --toc-depth=3 \
	       --highlight-style tango \
g.md
```

　上記の方法で目次付きのPDFファイルの生成が出来たのですが，先に見つけていた次のページを参考にしたもので，変換にエラーが起きていたので，エラーメッセージを見ながら怪しいオプションを３つほど削りました。余白が広すぎるという問題が残っているのですが，これはどうにかできそうです。

```
pandoc -o sample.pdf \
	       -N \
	       -f markdown+ignore_line_breaks+footnotes+definition_lists \
	       -V CJKmainfont=IPAexGothic \
	       -V titlepage=true \
	       -V toc-own-page=true \
	       -F pandoc-crossref \
	       --table-of-contents \
	       --toc-depth=3 \
	       --pdf-engine=lualatex \
	       --template eisvogel \
	       --highlight-style tango \
	       sample.md

［source：］Markdownで書いたテキストをPDFに変換してドキュメントを作成する方法（テンプレート活用編） - ククログ(2018-09-13) https://www.clear-code.com/blog/2018/9/13.html
```

　今度は，次のページを参考に，「 -V geometry:margin=1in」というオプションを追加して変換をしてみました。これだと上下左右全部が1インチの余白になりそうです。約2.4センチではなかったかと思います。

```
日本語でよく使われている文書クラスjsarticle、jarticleはLuaLateXでは使えないため、ltjarticle、ltjsarticleを使用します。
また、ltjsarticleはmicrotypeパッケージと相性が悪く、パッチをあててやる必要があります。
これについてはPandocを使ってMarkdownからPDFを生成するに解説があります。

わたしはだいたい以下のようなコマンドで変換しています。パッチをあてたltjsarticleを指定し、geometryパッケージで余白を1インチに設定しています。-Nは節に数字をふるオプション、--tocは目次をつけるオプションです。
デフォルト設定は余白が大きすぎるような気がするので何となく1インチにしてます。


$ pandoc -f markdown -o file.pdf -V documentclass=myltjsarticle --latex-engine=lualatex -V geometry：margin=1in -N --toc
これは以下のようなtexと等価です。

\documentclass{ltjsarticle}

\usepackage［margin=1in］{geometry}
2. dvipdfmxを使う
こっちは結構めんどくさいです。ただ、最初にテンプレートだけ用意してやればあとは使い回せると思います。

以下を変換します。

［source：］PandocとPDFのレイアウトの話 - Qiita https://qiita.com/takada-at/items/c807c163bd861bbec7cf
```
　PDFファイルなのでコピペに多少難がなりますが，目次は次のように作成されています。見出しのレベルが1から3まで全て数字ですが，テンプレートを読み込むかたちに出来れば，「第1，１，（１），ア」とWordで指定していたものと同じに出来るかもしれません。

1.1.19 「世界は変えられる。幸運は勇者に味方する。塾長 伊藤真 # がんばれ受験生シリーズ 2 」という伊藤塾のツイート,深澤諭史弁護士のリツイート . . . . . . . . . . . .32

　MySQLの「DEFAULT CHARSET=utf8mb4」のような問題が起きるかと思ったのですが，絵文字など日本語の特殊文字でエラーは出ませんでした。ただ，半角で「￥ｎ」と改行の文字があると，メッセージにコマンドの実行と扱われたようなエラーが出ていました。

## Node.jsで動作する markdown-pdfと，md-to-pdfを使ったMarkdownからPDFファイルの変換

　まず，あとにインストールしたmd-to-pdfです。yarnという見たことのないコマンドでインストールする方法しか見当たらなかったのですが，npmと同じ働きのような情報があったので，「npm -g install md-to-pdf」とやってみるとインストールが出来ました。

　npmコマンドは前にインストールをしていたのですが，markdown-pdfをインストールする時にパーミッションエラーが出ていました。次のページに解決方法がありました。

```
 mkdir ~/.npm-global
Configure npm to use the new directory path：
 npm config set prefix '~/.npm-global'
In your preferred text editor, open or create a ~/.profile file and add this line：
 export PATH=~/.npm-global/bin：$PATH
On the command line, update your system variables：
 source ~/.profile

［source：］Resolving EACCES permissions errors when installing packages globally | npm Documentation https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
```

　marddown-pdfとmd-to-pdfは，特にオプションの指定も必要なく簡単にPDFファイルへの変換が出来ました。md-to-pdfでは，次のページの方法でヘッダーとフッタの追加が出来ました。用紙サイズや余白のサイズも指定できるようです。

```
Header/Footerを追加する
公式にある下記のコードをmdファイル先頭に追加すれば、ヘッダーとフッターを追加することができる

---
pdf_options:
  format: A4
  margin: 30mm 20mm
  displayHeaderFooter: true
  headerTemplate: |-
    <style>
      section {
        margin: 0 auto;
        font-family: system-ui;
        font-size: 11px;
      }
    </style>
    <section>
      <span class="date"></span>
    </section>
  footerTemplate: |-
    <section>
      <div>
        Page <span class="pageNumber"></span>
        of <span class="totalPages"></span>
      </div>
    </section>
---

［source：］Markdownで書いたファイルをPDFで出力 | mebee https://mebee.info/2019/10/30/post-3147/
```

　雛形のような設定のテンプレートを読み込む方法が好ましいのですが，出来るかどうかを含め調べる必要があります。元はといえば，Markdownで，見出しを本文と一緒にドラッグアンドドロップで移動させる方法を探し，調べていたのですが，今回もよい方法が見つかっていません。

