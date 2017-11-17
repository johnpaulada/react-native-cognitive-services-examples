import React from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {RkButton} from 'react-native-ui-kitten';

const StyledView = styled.View`
  flex: 1;
  position: relative;
`
const AddButton = styled.View`
  position: absolute;
  right: 10;
  bottom: 10;
`
const ButtonText = styled.Text`
  color: #FAFAFA;
`
const ListText = styled.Text`
  color: #FAFAFA;
`
const MoodList = styled.FlatList`
  flex: 1;
`

const Layout = props => {
  const { navigate } = props.navigation;

  return <StyledView>
    <MoodList
      data={props.moods}
      renderItem={({item}) => {
        return <ListText>{item.mood}</ListText>
      }} />
    <AddButton>
      <RkButton onPress={() => navigate('Camera')}>Add</RkButton>
    </AddButton>
  </StyledView>
}

export default Layout