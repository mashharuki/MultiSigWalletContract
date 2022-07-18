import './App.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import detectEthereumProvider from '@metamask/detect-provider';
import walletContract from "./../contracts/MultiSigWallet.json";
import Web3 from "web3";
// mui関連のコンポーネントのインポート
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

/**
 * WalletTable
 * @param props 引数
 */
const WalletTable = (props) => {

    // propsから引数を取得する。
    const { _wallet, _columns, row, index } = props;

    // ウォレットの名前を格納するステート変数
    const [name, setName] = useState(null); 
    // ウォレットのアドレスを格納するステート変数
    const [addr, setAddr] = useState(null);
    // ownerの数を格納するステート変数
    const [ownerCounts, setOwnerCounts] = useState(0);
    // 閾値を格納するステート変数
    const [req, setReq] = useState(0);

    // トランザクション一覧画面に渡す要素
    const toTx = {
        addr: _wallet
    };

    /**
     * 初期化メソッド
     */
    const init = async(_wallet) => {
        // Web3が使えるように設定する。
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const instance = new web3.eth.Contract(walletContract.abi, _wallet);
        // ウォレットコントラクトの各情報を取得する。
        const wName = await instance.methods.getName().call();
        const required = await instance.methods.getRequired().call();
        const counts = await instance.methods.getOwnersCount().call();
        // ステート変数に格納する。
        setName(wName);
        setAddr(_wallet);
        setOwnerCounts(counts);
        setReq(required);
    };

    // 副作用フック
    useEffect(() => {
        init(_wallet);
    }, [_wallet]);

    return (
        <TableRow hover role="checkbox" tabIndex={-1}>
            {_columns.map((column) => {
                // セルに格納する値用の変数
                let value = row; 
                // カラムの値により、セットする値を変更する。
                if(column.label === "No.") {
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {index + 1}
                        </TableCell>
                    );
                }
                if(column.label === "Address") {
                    return (
                        <TableCell key={column.id} align={column.align}>
                            <Link to={"/txs"} state={toTx}>
                                {_wallet}
                            </Link>
                        </TableCell>
                    );
                }
                /* NameとStatusについては個別に条件が異なってくるので別関数で条件を整理して描画する。 */
                if(column.label === "Name") {
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {name}
                        </TableCell>
                    )
                } 
                if(column.label === "Owners") {
                    return (
                        <TableCell key={column.id} align={column.align}>
                            {ownerCounts}
                        </TableCell>
                    )
                }   
                if(column.label === "Required") {
                    return (
                        <TableCell key={column.id} align={column.align}>
                           {req}
                        </TableCell>
                    )
                }        
            })}
        </TableRow>
    );
};

export default WalletTable;