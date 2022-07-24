import './App.css';
import React, { useState, useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import FactoryContract from "./../contracts/WalletFactory.json";
import Web3 from "web3";
import ActionButton from './common/ActionButton';
import LoadingIndicator from './common/LoadingIndicator/LoadingIndicator';
// mui関連のコンポーネントのインポート
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

/** 
 * StyledPaperコンポーネント
 */
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: 1000,
    backgroundColor: '#fde9e8'
}));

/**
 * Createコンポーネント
 */
const Create = () => {
    // コントラクト用のステート変数
    const [contract, setContract] = useState(null); 
    // アカウント用のステート変数
    const [account, setAccount] = useState(null);
    // ウォレットの名前を格納するステート変数
    const [walletName, setWalletName] = useState(null);
    // ウォレットのownerのアドレスを格納する変数
    const [owners, setOwners] = useState([]);
    // ウォレットのownerのアドレスを格納するステート変数
    const [owner, setOwner] = useState(null);
    // ウォレットの閾値を格納するステート変数
    const [required, setRequired] = useState(0);
    // トランザクションが正常に処理された場合のフラグ
    const [successFlg, setSuccessFlg] = useState(false);
    // トランザクションが異常終了した場合のフラグ
    const [failFlg, setFailFlg] = useState(false);
    // ポップアップの表示を管理するフラグ
    const [showToast, setShowToast] = useState(false);
    // ローディングを表示するためのフラグ
    const [isLoading, setIsLoading] = useState(false);

    /**
     * コンポーネントが描画されたタイミングで実行する初期化関数
     */
    const init = async() => {
        try {
            // プロバイダー情報を取得する。
            const provider = await detectEthereumProvider();
            // Web3オブジェクト作成
            const web3 = new Web3(provider);
            // アカウント情報を取得する。
            const web3Accounts = await web3.eth.getAccounts();
            // ネットワークIDを取得する。
            const networkId = await web3.eth.net.getId();
            // コントラクトのアドレスを取得する。
            const deployedNetwork = FactoryContract.networks[networkId];
            // コントラクト用のインスタンスを生成する。
            const instance = new web3.eth.Contract(FactoryContract.abi, deployedNetwork && deployedNetwork.address,);
            // コントラクトとアカウントの情報をステート変数に格納する。
            setContract(instance);
            setAccount(web3Accounts[0]);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    };

    /**
     * 「Create」ボタンを押した時の処理
     */
    const createAction = async() => {
        console.log("owners:", owners)
        try {
            setIsLoading(true);
            // createWalletメソッドを呼び出す。
            await contract.methods.createWallet(walletName, owners, required).send({
                from: account,
                gas: 6500000
            });
            setIsLoading(false);
            // ownersの配列を空にする。
            setOwners([]);
            // popUpメソッドを呼び出す
            popUp(true);
        } catch(err) {
            console.error("regist err:", err);
            setIsLoading(false);
            // ownersの配列を空にする。
            setOwners([]);
            // popUpメソッドを呼び出す
            popUp(false);
        }
    };

    /**
     * +ボタンが押された時の処理
     */
     const addAddress = async () => {
        // 配列にアドレスを追加する。
        setOwners([...owners, owner]);
        // ステート変数を更新する。
        setOwner('');
        alert("アドレス追加完了！");
    };

    /**
     * ポップアップ時の処理を担当するメソッド
     * @param flg true：成功 false：失敗
     */
    const popUp = (flg) => {
        // 成功時と失敗時で処理を分岐する。
        if(flg === true) {
            // ステート変数を更新する。
            setSuccessFlg(true);
            setShowToast(true);       
            // 5秒後に非表示にする。
            setTimeout(() => {
                setSuccessFlg(false);
                setShowToast(false);             
            }, 5000);
        } else {
            // ステート変数を更新する。
            setFailFlg(true);
            setShowToast(true);     
            // 5秒後に非表示にする。
            setTimeout(() => {
                setFailFlg(false);
                setShowToast(false);
            }, 5000);
        }
    };

    // 副作用フック
    useEffect(() => {
        setIsLoading(true);
        init();
        setIsLoading(false);
    }, [account]);

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Box sx={{ flexGrow: 1, overflow: "hidden", px: 3, mt: 10, height: '80vh'}}>
                <StyledPaper sx={{my: 1, mx: "auto", p: 0, borderRadius: 4, marginTop: 4}}>
                    {isLoading ? (
                        <Grid container justifyContent="center">
                            <header className="loading">
                                <p><LoadingIndicator/></p>
                                <h3>Please Wait・・・・</h3>
                            </header>
                        </Grid>
                    ) : ( 
                        <>
                            <Grid container justifyContent="center">
                                <Grid 
                                    container
                                    justifyContent="center"
                                    sx={{ 
                                        alignItems: 'center', 
                                        m: 1,
                                    }}
                                >
                                    <p><strong>Please enter wallet info</strong></p>
                                </Grid>
                                <Grid 
                                    container 
                                    justifyContent="center"
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        m: 1,
                                        marginTop: 4
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{ 
                                            p: '2px 4px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: '#fde9e8',
                                            width: 450, 
                                            marginTop: 1
                                        }}
                                    >  
                                        <label>Wallet Name：</label>
                                        <TextField 
                                            id="WalletName" 
                                            placeholder="Wallet Name" 
                                            margin="normal" 
                                            required
                                            onChange={ (e) => setWalletName(e.target.value) } 
                                            variant="outlined" 
                                            inputProps={{ 'aria-label': 'WalletName' }} 
                                        />
                                    </Paper>
                                </Grid>
                                <Grid 
                                    container 
                                    justifyContent="center"
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        m: 1,
                                        marginTop: 4
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{ 
                                            p: '2px 4px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: '#fde9e8',
                                            width: 500, 
                                            marginTop: 4
                                        }}
                                    >  
                                        <label>Owner's address：</label>
                                        <TextField 
                                            id="ownerAddress" 
                                            placeholder="owners's Address" 
                                            margin="normal" 
                                            required
                                            value={owner}
                                            onChange={ (e) => setOwner(e.target.value) } 
                                            variant="outlined" 
                                            inputProps={{ 'aria-label': 'ownerAddress' }} 
                                        />
                                        <Button 
                                            onClick={addAddress} 
                                            sx={{ margin: 1}} 
                                            variant="contained" 
                                            color="inherit" 
                                            className="cta-button"
                                        > 
                                            + 
                                        </Button>
                                    </Paper>
                                </Grid>
                                <Grid 
                                    container 
                                    justifyContent="center"
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        m: 1,
                                        marginTop: 4
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{ 
                                            p: '2px 4px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: '#fde9e8',
                                            width: 450, 
                                            marginTop: 1
                                        }}
                                    >  
                                        <label>Required：</label>
                                        <TextField 
                                            id="Required" 
                                            placeholder="Required" 
                                            margin="normal" 
                                            required
                                            type="number"
                                            onChange={ (e) => setRequired(e.target.value) } 
                                            variant="outlined" 
                                            inputProps={{ 'aria-label': 'Required' }} 
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid 
                                container 
                                justifyContent="center"
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    m: 1,
                                    marginTop: 4
                                }}
                            >
                                <ActionButton buttonName="Create" color="error" clickAction={createAction} />
                            </Grid>
                        </>
                    )}
                </StyledPaper>
            </Box>
            {successFlg && (
                /* 成功時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="secdesc">Create Trasaction Successfull!!</div>
                </div>
            )}
            {failFlg && (
                /* 失敗時のポップアップ */
                <div id="toast" className={showToast ? "zero-show" : ""}>
                    <div id="desc">Create Trasaction failfull..</div>
                </div>
            )}
        </Grid>
    );
}

export default Create;