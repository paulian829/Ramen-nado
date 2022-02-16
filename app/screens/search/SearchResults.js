/* eslint-disable prettier/prettier */
/**
 *
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { getAuth } from 'firebase/auth';

import { FlatList, SafeAreaView, StatusBar, StyleSheet, View, Alert, ToastAndroid } from 'react-native';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import Button from '../../components/buttons/Button';

import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import { Paragraph } from '../../components/text/CustomText';

import Colors from '../../theme/colors';

import sample_data from '../../config/sample-data';
import TouchableItem from '../../components/TouchableItem';
import uuid from 'react-native-uuid';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  productList: {
    padding: 12,
  },
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 32,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  extraSmallButton: {
    width: '48%',
  },
  resetbtn: {
    width: '48%',
    backgroundColor: 'blue',
  },
});

export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: sample_data.search_products,
      min: 0,
      max: 0,
      count: 0,
      budget: 0,
      extras: [],
      retries: 0,
      resultRandom: [],
      reset: 0,
    };
  }

  navigateTo = (screen, key) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, {
      key: key,
    });
  };


  componentDidMount() {
    this.getData();
  }

  async getData() {
    const { route } = this.props;
    const { max, count } = route.params;
    let budget = max / count;
    // this.setState({
    //   max: max,
    //   budget: budget,
    //   count: count,
    // });
    this.setState({
      max: max,
      budget: budget,
      count: count,
    });
    let products = this.state.products;
    let numberOfProducts = products.length;
    let randomProducts = [];
    let randomProductsFinal = [];
    for (let i = 0; i < count; i++) {
      let totalPrice = 0;
      let loopCount = 0;
      console.log('UserID', i);
      randomProducts = [];
      while (true) {
        let random = Math.floor(Math.random() * (numberOfProducts - 0)) + 0;
        console.log(random);
        loopCount = loopCount + 1;
        if (loopCount >= 1000) { break; }

        console.log(randomProducts.filter(vendor => vendor.randomID === random));
        if (randomProducts.filter(vendor => vendor.randomID === random).length < 1) {
          if ((totalPrice + products[random].price) < budget) {
            totalPrice = totalPrice + products[random].price;
            console.log(products[random].price, totalPrice);
            randomProducts.push(products[random]);
            randomProducts[randomProducts.length - 1].randomID = random;
          }
        }

      }
      randomProductsFinal.push(randomProducts);


    }
    console.log(randomProductsFinal);
    // Get the product Array
    // Loop number of Count
    // Randomly Select 1 Product that is less than the budget
    // Check if the Selected product had a duplicate on the Existing array of products
    // Add the total Price of the 1 product
    // If the total price is less than the budget Repeat loop
    // Else if the total price is more than the budget per person
    // Proceed to the next Person

  }



  keyExtractor = (item, index) => index.toString();

  renderProductItem = ({ item, index }) => {

    return (
      <View>
        <ActionProductCardHorizontal
          onCartPress={this.navigateTo('Cart')}
          swipeoutDisabled
          plusDisabled
          key={index}
          imageUri={item.imageUri}
          title={item.name}
          description={item.description}
          price={item.price}

          label={item.label}
        />
      </View>

    );
    // }
  }
  Reset() {
    this.getData();
  }

  render() {
    const { resultRandom, products, max, count, budget, reset } = this.state;
    // this.setState({resultRandom:randomItems});

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        <Paragraph style={styles.instruction}>
          You have a max budget of ₱{max} for {count} person. With an Average budget of ₱{budget} per person
        </Paragraph>
        <View style={styles.buttonsContainer}>
          <Button
            onPress={() => { this.Reset(); }}
            disabled={false}
            small
            title={'Reset'.toUpperCase()}
            buttonStyle={styles.extraSmallButton}
          /><Button
            onPress={() => this.addToCart()}
            disabled={false}
            small
            title={'Add to Cart'.toUpperCase()}
            buttonStyle={styles.resetbtn}
          />
        </View>


        <FlatList
          key={reset}
          data={products}
          // data={resultRandom}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderProductItem}
          contentContainerStyle={styles.productList}
        />
      </SafeAreaView>
    );
  }
}
