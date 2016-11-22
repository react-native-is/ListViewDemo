/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/
/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/
//connect PostgreSQL
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
    NetInfo,
} from 'react-native';

import WebServiceHandler from 'react-native-web-service-handler';
//Khởi tạo dữ liệu
// Có thể lấy từ các Service hay truy vấn SQL
export default class MyListView extends Component {
    constructor(props){
        console.log("const");
        super(props);

        this.ds = new ListView.DataSource({
            rowHasChanged:(r1,r2)=>r1 !== r2
        });
        //Lưu dataSource vào state
        this.state={
            dataSource : []
        }
        //binding cursor this to function _renderRow
        this._renderRow = this._renderRow.bind(this);

        //this.getJSONFromApiAsync();
        this.getAllTask();
    }
    componentDidMount() {
     NetInfo.isConnected.addEventListener(
       'change',
       this._handleConnectivityChange
     );
   }
    componentWillUnmount() {
     NetInfo.isConnected.removeEventListener(
       'change',
       this._handleConnectivityChange
     );
   }
    _handleConnectivityChange(status) {
     console.log('*********_handleConnectivityChange: Network Connectivity status *******: ' + status);

    }
    render(){
        console.log("render");
        return(
            <View>
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.dataSource)}
                    renderRow={this._renderRow}
                />
            </View>
        );
    }
    //Custom method tạo hàng
    _renderRow(data){
        var isDone = data._isDone;
        var icon = isDone === true ? require('./images/check.png') : require('./images/uncheck.png');
        // console.log(icon);
        return (
            <View style={styles.task}>
                <TouchableOpacity onPress = {()=>this._onTick(data)}>
                    <View>
                        <Image source={icon} style={styles.tick} />
                    </View>
                </TouchableOpacity>
                <View>
                    <Text style ={{color:'red'}}>{data._Name}</Text>
                    <Text>{data._Date}</Text>
                </View>
            </View>
        );
    }
    _onPressButton() {
        console.log("You tapped the button!");
        //change isDone to yes if it is no and otherwise
        console.log("Hello World!");
    }
    _onTick(data){
        //da lay duoc row data
        console.log("Ticked");
        console.log("data onTick la : "+data._Name);
        console.log(data._Date + "-- id = " + data._ID);
        var DS = this.state.dataSource.slice();
        var index = 0;

        //find index of task selected
        for(let i = 0 ; i < DS.length ; i++){
            //console.log("ID :"+DS[i].id);
            if(DS[i]._ID === data._ID){
                index = i;
                break;
            }
        }
        console.log("index dang chon de update la : "+index );

        //update isDone
        var isDone = data._isDone === true ? false : true ;
        var task = {
            '_ID':data._ID,
            '_Name':data._Name,
            '_Date':data._Date,
            '_isDone':isDone
        };
        //cap nhat csdl
        this.updateTask(task,index);
    }

    async getAllTask() {
        console.log("async getAllTask calling");
        var REQUEST_URL = 'http://10.0.2.228:2800/ReactNativeService/Task_Servlet';
        try {
            let response = await fetch(REQUEST_URL, {
                method: 'get',
                dataType: 'json',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                //send no data
                // body: JSON.stringify({
                //     action : 'update',
                //     _ID: task._ID,
                //     _Name : task._Name,
                //     _Date : task._Date,
                //     _isDone : task._isDone
                // })
            });
            let responseJson = await response.json();
            var result = await responseJson.result

            console.log(result);
            if(result === "OK"){
                var dataset = responseJson.dataset;
                this.setState({
                    dataSource : dataset
                });

                //log
                var row = 0;
                for(let i = 0 ; i < dataset.length ; i++){
                    row ++;
                }
                console.log("Added "+ row + " row(s)");
                return dataset;
            }
            else{
                console.log("Loi khi truy van toi server roi !");
            }

            return responseJson.result;
        } catch(error){
            console.error(error);
        }
    }
    async updateTask(task,index) {
        console.log("async updateTask calling");
        var REQUEST_URL = 'http://10.0.2.228:2800/ReactNativeService/Task_Servlet';
        try {
            let response = await fetch(REQUEST_URL, {
                method: 'post',
                dataType: 'json',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action : 'update',
                    _ID: task._ID,
                    _Name : task._Name,
                    _Date : task._Date,
                    _isDone : task._isDone
                })
            });
            let responseJson = await response.json();
            var result = await responseJson.result
            var DS = this.state.dataSource.slice();

            console.log("async result : "+ result);
            if(result === true){
                DS[index] = task;
                this.setState({
                    dataSource : DS
                });
                console.log("Update thanh cong index :"+index
                    + " isDone changed to  "+ task._isDone);
            }
            else{
                console.log("Update fail");
            }

            return responseJson.result;
        } catch(error){
            console.error(error);
        }
    }

    //promisee es6
    // sendToServer(task) {
    //     // console.log("sendToServer");
    //     // console.log(task._ID);
    //     var REQUEST_URL = 'http://10.0.2.228:2800/ReactNativeService/Task_Servlet';
    //     return fetch(REQUEST_URL, {
    //         method: 'post',
    //         dataType: 'json',
    //         headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             action : 'update',
    //             _ID: task._ID,
    //             _Name : task._Name,
    //             _Date : task._Date,
    //             _isDone : task._isDone
    //         })
    //     })
    //     .then((response) =>{
    //         //console.log(response);
    //         return response.json();
    //     })
    //     .then((json)=>{
    //         var result = json.result;
    //         console.log("result o sendToServer la : "+result);
    //         return result;
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });
    // }
    // getJSONFromApiAsync() {
    //     var REQUEST_URL = 'http://10.0.2.228:2800/ReactNativeService/Task_Servlet';
    //     return fetch(REQUEST_URL, {
    //         method: 'get',
    //         dataType: 'json',
    //         headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //         },
    //         // body: JSON.stringify({
    //         //     // firstParam: 'yourValue',
    //         //     // secondParam: 'yourOtherValue',
    //         // })
    //     })
    //     .then((response) =>{
    //         return response.json();
    //     })
    //     .then((json)=>{
    //         var result = json.result;
    //         console.log(result);
    //         if(result === "OK"){
    //             var dataset = json.dataset;
    //             this.setState({
    //                 dataSource : dataset
    //             });
    //
    //             //log
    //             var row = 0;
    //             for(let i = 0 ; i < dataset.length ; i++){
    //                 row ++;
    //             }
    //             console.log("Added "+ row + " row(s)");
    //             return dataset;
    //         }
    //         else{
    //             console.log("Loi khi truy van toi server roi !");
    //         }
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });
    // }
}
const styles = StyleSheet.create({
    task:{
        margin : 5,
        borderWidth : 1,
        borderColor : 'skyblue',
        padding : 10,
    },
    tick:{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        top :0,
        right:0,
        bottom:0,
        left:0,
        width :20,
        height:20
    }
});
    AppRegistry.registerComponent('MyListView', () => MyListView);

//cant connect pg in treact Native
//use json network : https://facebook.github.io/react-native/docs/network.html
