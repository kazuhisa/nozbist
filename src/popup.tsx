import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button, Input, Box, Heading } from "@chakra-ui/react"
import { ChakraProvider } from "@chakra-ui/react"
import { FormErrorMessage, FormLabel, FormControl } from '@chakra-ui/react'

type FormData = {
  username: string;
};

const getGitHubStats = (username: string) => {
  return axios.get<string>(
    `https://github-readme-stats.vercel.app/api?username=${username}&count_private=true&show_icons=true`
  );
};

const getGitHubTopLanguage = (username: string) => {
  return axios.get<string>(
    `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact`
  );
};

const getGitHubUsername = (url: string): string => {
  try {
    const urlObj = new URL(url);
    console.log(urlObj.hostname);
    if (urlObj.hostname === "github.com") {
      return urlObj.pathname.split("/")[1];
    }
  } catch { }

  return "";
};

const Popup = () => {
  const [username, setUsername] = useState("");
  const [currentStats, setCurrentStats] = useState("");
  const [currentTopLanguage, setCurrentTopLanguage] = useState("");
  const {
    register,
    setValue,
    handleSubmit,
    formState,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data) => {
    console.log(data["username"]);
    setUsername(data["username"]);
  });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentURL = tabs[0].url || "";
      const name = getGitHubUsername(currentURL);
      setUsername(name);
      setValue("username", name);
    });
  }, []);

  useEffect(() => {
    const fetch = async (username: string) => {
      const stats = await getGitHubStats(username);
      const lang = await getGitHubTopLanguage(username);
      setCurrentTopLanguage(lang.data);
      setCurrentStats(stats.data);
    };
    console.log(username);
    if (username !== "") {
      console.log(username);
      fetch(username);
    }
  }, [username]);

  const login = () => {
    chrome.identity.launchWebAuthFlow(
      {
        // url: 'https://api.nozbe.com:3000/login?client_id=c09481e1e01e60cc585ba6631277980b6f17dcda',
        url: 'https://api.nozbe.com:3000/login?client_id=3d22b033024918c4a9ebb286803b979398bba006', // test
        interactive: true,
      },
      responseUrl => {
        if (responseUrl != null) {
          const all_params = responseUrl.match(/\?.*/);
          if (all_params != null) {
            const params = new URLSearchParams(all_params[0].substring(1));
            const access_token = params.get('access_token');
            if (access_token != null) {
              localStorage.setItem('access_token', access_token);
            }
          }
        }
      }
    );
  }

  return (
    <>
      <ChakraProvider>
        <Box w="540px">
          <Box>
            <Heading>
              Nozbe Chrome Extension
            </Heading>
            <Button onClick={login}>Login</Button>
          </Box>
        </Box>
      </ChakraProvider>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
