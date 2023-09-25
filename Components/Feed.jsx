'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCarList = ({data, handleTagClick}) => {
  return(
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {

  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  }
  
  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
    }

    fetchPost();
  },[]);

  useEffect(() => {
    const searchInterval = setTimeout(() => {
      setSearchQuery(searchText);
    }, 1000);

    return(() => {
      clearTimeout(searchInterval);
    })
  },[searchText]);

  useEffect(() => {
    const getSearchResult = async (searchQuery) => {
      try{
        const response = await fetch(`/api/search?searchQuery=${searchQuery}`);
        const data = await response.json();
        setPosts(data);
        
      }
      catch(err){
        console.log(err);
      }
    }
    
    getSearchResult(searchQuery);
  }, [searchQuery]);

  const handleTagClick = (tag) => {
    setSearchText(tag.slice(1))
  }

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input 
          type="text" 
          placeholder='Search for tag or a username' 
          required
          value={searchText}
          onChange={handleSearchChange}
          className='search_input peer'
        />
      </form>
      <PromptCarList
        data={posts}
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed