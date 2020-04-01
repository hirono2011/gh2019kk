# Wordでのアウトラインの作成と，VBAによる対応したフォルダ，ファイルの作成


## Wordで見出しの一覧からフォルダとファイルを作成するシェルスクリプトの文字列をファイルに書き出すVBA

```
Sub 見出しのディレクトリーを作成()
  Dim par As Paragraph
  Dim title As String
  Dim lv1 As String
  Dim lv2 As String
  Dim lv3 As String
  Dim lv4 As String
  Dim i As Integer
  i = 1
    Dim datFile As String
    Const F_PATH = "\\wsl$\Ubuntu\home\myhome\word_list.txt"  ' 出力ファイルのフルパス
    Dim f_num As Integer  ' ファイル番号

    f_num = FreeFile
    Open F_PATH For Output As f_num

  For Each par In ActiveDocument.Paragraphs
    If par.OutlineLevel <> wdOutlineLevelBodyText Then
     Select Case par.OutlineLevel
        Case 1
            i = i + 1
        Case 2
            i = i + 1
        Case 3
            i = i + 1
        Case 4
            i = i + 1
        Case Else
            'MsgBox "入力が不正です"
     End Select
     End If
    Next par


Dim max As Integer
max = i
i = 0
Dim entryies() As String
ReDim entryies(max)

    MsgBox max

  For Each par In ActiveDocument.Paragraphs
    If par.OutlineLevel <> wdOutlineLevelBodyText Then
     title = Replace(par.Range.Text, vbCr, "")

     If par.OutlineLevel = 1 Then
        lv1 = title
     End If

     If par.OutlineLevel = 2 Then
        lv2 = title
     End If

     If par.OutlineLevel = 3 Then
        lv3 = title
     End If

     If par.OutlineLevel = 4 Then
        lv4 = title
     End If


    Select Case par.OutlineLevel
        Case 1
            i = i + 1
            entryies(i) = "mkdir -p " & lv1
        Case 2
            i = i + 1
            entryies(i) = "mkdir -p " & lv1 & "/" & lv2
        Case 3
            i = i + 1
            entryies(i) = "mkdir -p " & lv1 & "/" & lv2 & "/" & lv3
        Case 4
            i = i + 1

            entryies(i) = "if [ ! -s """ & lv1 & "/" & lv2 & "/" & lv3 & "/" & lv4 & ".md" & """ ]; then  touch " & lv1 & "/" & lv2 & "/" & lv3 & "/" & lv4 & ".md" & "; fi"

        Case Else
            'MsgBox "入力が不正です"
    End Select

     'Selection.TypeText par.OutlineLevel & title & vbCr
    End If


  Next par

    For i = 0 To max
        'Selection.TypeText Var

        Print #f_num, entryies(i)
        Debug.Print ">>" & entryies(i)

    Next i

    Close #f_num
End Sub
```

作成されたファイルの一部：
```
[1995]  % tail ~/word_list.txt
mkdir -p 被告発人らの犯罪事実（共謀・共犯関係）/被告発人岡田進弁護士（金沢弁護士会）
mkdir -p 被告発人らの犯罪事実（共謀・共犯関係）/被告発人木梨松嗣（金沢弁護士会）
mkdir -p 被告発人らの犯罪事実（共謀・共犯関係）/被告発人長谷川紘之弁護士（金沢弁護士会）
mkdir -p 被告発人らの犯罪事実（共謀・共犯関係）/被告発人若杉幸平弁護士（金沢弁護士会）
mkdir -p 被告発人らの犯罪事実（共謀・共犯関係）/被告発人小島裕史裁判長（平成5年当時の名古屋高裁金沢支部裁判長）
mkdir -p 情報公開のご説明及び参考資料
mkdir -p 情報公開のご説明及び参考資料/書面の作成環境（プラットホーム）
mkdir -p 情報公開のご説明及び参考資料/書面の作成環境（プラットホーム）/Windows10
if [ ! -s "情報公開のご説明及び参考資料/書面の作成環境（プラットホーム）/Windows10/Wordでのアウトラインの作成と，VBAによる対応したフォルダ，ファイルの作成.md" ]; then  touch 情報公開のご説明及び参考資料/書面の作
成環境（プラットホーム）/Windows10/Wordでのアウトラインの作成と，VBAによる対応したフォルダ，ファイルの作成.md; fi
```

WSLのLinux環境に合わせ文字コードと改行コードを変換：
% nkf --overwrite -w -Lu ~/word_list.txt

スクリプトの実行（ファルだとファイルの生成：
% cat ~/word_list.txt |bash
