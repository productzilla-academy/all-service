import { Career, Level } from "../../core/careers";
import { Course, Module, Options, Question, QuestionType, Quiz } from "../../core/courses";

export const careers: Career[] = [
  {
    name: 'ux-researcher'
  },
  {
    name: 'ui-designer'
  },
  {
    name: 'backend-developer'
  },
  {
    name: 'frontend-developer'
  },
  {
    name: 'solution-architect'
  },
  {
    name: 'software-engineer'
  }
]

export const levels: Level[] = [
  {
    name: 'foundation',
    number: 1
  },
  {
    name: 'basic',
    number: 2
  },
  {
    name: 'intermediate',
    number: 3
  },
  {
    name: 'advanced',
    number: 4
  },
  {
    name: 'master',
    number: 5
  }
]

export const courseExample: Course = {
  name: `UX Law`,
  description: `7 UX Law Lorem Ipsum dolor xxx `,
  open: new Date(),
  status: 1,
  tutor: `yuriabusra`,
  overview: `Lorem ipsum`,
  career: [{
    career: {
      name: `ux-researcher`
    },
    level: {
      name: 'foundation'
    } as Level,
    number: 1
  }]
}

export const moduleExample: Module = {
  name: 'Introduction',
  weight: 10,
  content: `<div class="ab ac ae af ag dl ai aj"><p id="c624" class="im in do io b ip iq ir is it iu iv iw ix iy iz ja jb jc jd je jf jg jh ji jj dg el" data-selectable-paragraph="">A few weeks ago, I saw that quite a stir was made about “<a href="https://lawsofux.com/" class="cl ie" target="_blank" rel="noopener nofollow"><strong class="io jk">Laws of UX</strong></a>”, a very simple web page that talks about the main laws of the UX (User Experience). It is a fantastic site that I 100% recommend.</p><p id="fd9e" class="im in do io b ip iq ir is it iu iv iw ix iy iz ja jb jc jd je jf jg jh ji jj dg el" data-selectable-paragraph="">If we had to generate a headline about UX laws…</p><h1 id="1a2b" class="jl hh do cf hi jm jn ir hm jo jp iv hq jq jr js hu jt ju jv hy jw jx jy ic jz el" data-selectable-paragraph=""><strong class="ay">“</strong>The collection of laws or design standards that designers must take into account when thinking and improving the user experience”.</h1><p id="5017" class="im in do io b ip ka ir is it kb iv iw ix kc iz ja jb kd jd je jf ke jh ji jj dg el" data-selectable-paragraph="">Good design tends to follow general principles that give designers general guidelines to work with. But for interface designers and user experience, there are also certain laws that everyone should consider.</p><p id="1526" class="im in do io b ip iq ir is it iu iv iw ix iy iz ja jb jc jd je jf jg jh ji jj dg el" data-selectable-paragraph="">In “<strong class="io jk">Laws of UX</strong>”, each law gets its own graphic representation inspired by the classic covers of minimalist books. Instead of simply collecting them as a list, the goal is to help people memorize these laws.</p><blockquote class="kf"><p id="14f7" class="kg kh do dp b ki kj kk kl km kn jj fy" data-selectable-paragraph="">“It’s easier to remember an object, whether it be an image or a video, than a text”</p></blockquote><p id="ac3d" class="im in do io b ip ko ir is it kp iv iw ix kq iz ja jb kr jd je jf ks jh ji jj dg el" data-selectable-paragraph="">Obviously, these representations are more than discussed and disseminated on the web, and I do not intend to discuss them here (besides, I am 100% in agreement with them) <strong class="io jk">but to pose some examples with real products on these laws.</strong> Let’s begin!</p></div>`,
  description: `test`,
  overview: `Lorem ipsum`
} as Module
export const quizExample: Quiz = {
  description: `Prev Material`,
  name: `Excersice 1`,
  can_retry: false
} as Quiz

export const questionExample: Question = {
  question: `Select bellow that One OF UX Law`,
  type: QuestionType.MULTIPLE_CHOISE,
  weight: 5
} as Question

export const optionsExample: Options[] = [
  {
    label: 'A',
    value: 'UX A',
    is_answer: true
  },
  {
    label: 'B',
    value: 'UX B',
    is_answer: false
  }
]