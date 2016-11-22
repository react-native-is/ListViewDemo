/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';
//Khởi tạo dữ liệu
// Có thể lấy từ các Service hay truy vấn SQL
var DATA = [
    {'task':"Đi chơi",ngay : "21-11-2016"},
    {'task':"Gặp đối tác",ngay : "19-11-2016"},
    {'task':"Cafe với bạn",ngay : "25-11-2016"},
    {'task':"Deadline Di Động",ngay : "21-11-2016"},
    {'task':"Nộp báo cáo nghiên cứu",ngay : "19-11-2016"},
    {'task':"Phân tích yêu cầu khách hàng",ngay : "21-11-2016"},
    {'task':"Về quê",ngay : "25-11-2016"},
    {'task':"Demo React Native",ngay : "21-11-2016"},
    {'task':"Nộp báo cáo cuối khoá",ngay : "19-11-2016"},
    {'task':"Phân tích dữ liệu",ngay : "21-11-2016"},
    {'task':"Đi Tây Nguyên",ngay : "25-11-2016"},
    {'task':"Đi tập GYM",ngay : "21-11-2016"},
    {'task':"Mua hàng cho sếp",ngay : "19-11-2016"},
    {'task':"Phỏng vấn tạo công ty TMA",ngay : "21-11-2016"}
];
export default class MyListView extends Component {
    constructor(props){
        super(props);
        var ds = new ListView.DataSource({
            rowHasChanged:(r1,r2)=>r1 !== r2
        });
        //Lấy DATA tử truy vấn PostgreSQL

        //Lưu dataSource vào state
        this.state={
            dataSource : ds.cloneWithRows(DATA)
        }
        //cloneWithRows sẽ tạo các hàng bằng method renderRow ở ListView
    }
    render(){
        return(
            <View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
            </View>
        );
    }
    //Custom method tạo hàng
    _renderRow(data){
        return (
            <View style={styles.task}>
                <Text style ={{color:'red'}}>{data.task}</Text>
                <Text>{data.ngay}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    task:{
        margin : 5,
        borderWidth : 1,
        borderColor : 'skyblue',
        padding : 5,
    }
});
    AppRegistry.registerComponent('MyListView', () => MyListView);
