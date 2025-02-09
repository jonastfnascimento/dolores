<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { Props } from './types';

import { useDevice } from '@/composables/useDevice';
import { useDate } from '@/composables/useDate';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

import CreateCard from '@/components/Common/CreateCard/CreateCard.vue';
import EmptyPlace from './EmptyPlace/EmptyPlace.vue';

const props = defineProps<Props>();

const { isMobile } = useDevice();

const formattedItems = computed(() => {
  return props.items.map((item) => {
    let id = 0;
    let name = '';
    let date = '';
    let url = '';
    let publications = 0;
    //conteudo
    let persona = '';
    let avatar = '';

    if (props.types === 'avatar') {
      id = item.id_avatar;
      name = item.company_name;
      date = item.created_at;
      publications = item.related_publications;
      url = `/avatars/${item.id_avatar}`;
    }

    if (props.types === 'persona') {
      id = item.id_target;
      name = item.name;
      date = item.created_at;
      publications = item.related_publications;
      url = `/personas/${item.id_target}`;
    }

    if (props.types === 'content') {
      id = item.id;
      name = item.keyword;
      persona = item['Nome Persona'];
      avatar = item['Nome Avatar'];
      url = `/content/${item.id}`;
    }

    return {
      id,
      name,
      date,
      publications,
      url,
      persona,
      avatar,
    };
  });
});

const listingUrl = computed(() => {
  if (props.types === 'avatar') return '/avatars';
  if (props.types === 'persona') return '/personas';
  return '/contents';
});

const saveUrl = computed(() => {
  if (props.types === 'avatar') return '/create/avatar';
  if (props.types === 'persona') return '/create/persona';
  return '/create/content';
});
</script>

<template>
  <div class="shelf-mate">
    <div class="shelf-mate__top row column">
      <p class="shelf-mate__title">
        {{ props.label }}
      </p>
      <RouterLink
        v-if="formattedItems.length"
        :to="listingUrl"
        class="shelf-mate--link"
      >
        Ver Todos
      </RouterLink>
    </div>

    <Swiper
      v-bind="{
        slidesPerView: 'auto',
        spaceBetween: 9,
      }"
      v-if="formattedItems.length"
      class="shelf-mate__slide"
    >
      <SwiperSlide class="slide-item shelf-mate__create">
        <RouterLink :to="saveUrl">
          <CreateCard :type="props.types" />
        </RouterLink>
      </SwiperSlide>

      <SwiperSlide
        v-for="(item, itemIndex) in formattedItems"
        :key="`item${itemIndex}`"
        :class="['shelf-mate__item', 'slide-item', props.types]"
      >
        <div class="shelf-mate__item-cointainer">
          <div class="shelf-mate__item-profile">
            <RouterLink :to="item.url" class="shelf-mate--item-img">
              <img
                v-if="props.types === 'avatar'"
                src="./img/avatar.png"
                :width="isMobile ? 54 : 70"
                :height="isMobile ? 54 : 70"
              />
              <img
                v-else-if="props.types === 'persona'"
                src="./img/persona.svg"
                :width="isMobile ? 54 : 70"
                :height="isMobile ? 54 : 70"
              />
              <canvas
                v-else
                :width="isMobile ? 166 : 288"
                :height="isMobile ? 63 : 90"
                style="background-color: #c1c1c1; border-radius: 8px"
              ></canvas>
            </RouterLink>

            <RouterLink :to="item.url" class="shelf-mate--item-name">
              {{ item?.name || '-' }}
            </RouterLink>
          </div>

          <div class="shelf-mate__container-texts">
            <template v-if="props.types !== 'content'">
              <p v-if="item?.date.length" class="shelf-mate__item-date">
                <img src="./img/calendar.svg" />
                {{ useDate(item?.date) }}
              </p>

              <p v-if="!!item?.publications" class="shelf-mate__item-publics">
                ({{ item?.publications }} publicações)
              </p>
            </template>

            <template v-else>
              <p class="shelf-mate__content-caracteristic one">
                <img
                  src="./img/miniuser.svg"
                  alt=""
                  :width="isMobile ? 12 : 20"
                  :height="isMobile ? 12 : 20"
                />
                {{ item.persona }}
              </p>
              <p class="shelf-mate__content-caracteristic">
                <img
                  src="./img/miniavatar.svg"
                  alt=""
                  :width="isMobile ? 12 : 20"
                  :height="isMobile ? 12 : 20"
                />
                {{ item.avatar }}
              </p>
            </template>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <div v-else class="shelf-mate__no-results row column">
      <EmptyPlace :types="props.types" />
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
